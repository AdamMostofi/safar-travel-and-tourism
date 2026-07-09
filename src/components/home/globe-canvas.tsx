'use client'

import { useEffect, useRef, useState } from 'react'
import { geoBounds, geoGraticule, geoOrthographic, geoPath, timer } from 'd3'
import type { Feature, FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson'

/**
 * Interactive wireframe-dotted globe for the home hero (issue #26), adapted from
 * the 21st.dev "Wireframe Dotted Globe" (Canvas 2D + d3-geo, *not* WebGL) and
 * re-themed to Ocean Breeze. The land is stippled with dots sampled inside each
 * country polygon, laid over a graticule and a deep-sea sphere with a soft glow
 * rim. It auto-rotates, and the visitor can drag to spin and scroll to zoom.
 *
 * This is the heavy, desktop-first enhancement: it is only ever mounted by
 * `GlobeHero` when `shouldRenderLiveGlobe` passes (fine pointer, full motion,
 * enough cores), and it is code-split via `next/dynamic({ ssr: false })` so d3
 * and the canvas never touch first paint. The land GeoJSON is vendored locally
 * at `public/geo/ne_110m_land.json` (Natural Earth 110m, public domain) and
 * fetched from our own origin — never from a third-party host at runtime.
 */

/** Land polygons carry no properties we use, so keep the feature shape minimal. */
type LandData = FeatureCollection<Polygon | MultiPolygon>

/** A land dot in geographic space (degrees); projected fresh every frame. */
type Dot = { lng: number; lat: number }

// Ocean Breeze palette (see docs/design-system.md / tailwind.config.ts).
const INK = '#243447' // deep slate — the far side of the sea sphere
const SEA = '#0e7490' // ocean teal — the lit centre of the sphere
const SKY = '#7dd3fc' // bright cyan — graticule + land dots
const CREAM = '#f0f8ff' // airy near-white — land outlines
const GLOW = '#5eead4' // teal-mint — soft rim glow (replaces the hard white stroke)

/** Dot density: smaller sampling step = denser stipple (see `generateDots`). */
const DOT_SPACING = 16
/** Degrees/frame of idle auto-rotation; drag overrides, releasing resumes it. */
const AUTO_ROTATE_SPEED = 0.22

/** Standard ray-casting point-in-polygon test (ring is a closed lng/lat loop). */
function pointInRing(point: [number, number], ring: Position[]): boolean {
  const [x, y] = point
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

/** Whether a lng/lat point falls on land (inside the outer ring, outside holes). */
function pointInFeature(point: [number, number], feature: Feature): boolean {
  const geometry = feature.geometry
  if (geometry.type === 'Polygon') {
    const [outer, ...holes] = geometry.coordinates
    if (!pointInRing(point, outer)) return false
    return !holes.some((hole) => pointInRing(point, hole))
  }
  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.some(([outer, ...holes]) => {
      if (!pointInRing(point, outer)) return false
      return !holes.some((hole) => pointInRing(point, hole))
    })
  }
  return false
}

/** Sample a grid of dots inside a land feature's bounding box, keeping the hits. */
function generateDots(feature: Feature, spacing = DOT_SPACING): Dot[] {
  const dots: Dot[] = []
  const [[minLng, minLat], [maxLng, maxLat]] = geoBounds(feature)
  const step = spacing * 0.08
  for (let lng = minLng; lng <= maxLng; lng += step) {
    for (let lat = minLat; lat <= maxLat; lat += step) {
      if (pointInFeature([lng, lat], feature)) dots.push({ lng, lat })
    }
  }
  return dots
}

export default function GlobeCanvas({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    // Projection + rotation are the shared state a later slice (#28) layers
    // destination markers onto: any waypoint is just `projection([lng, lat])`
    // with the same rotation, drawn in `render` after the dots. Keep them in
    // this scope so that seam stays a one-liner.
    const projection = geoOrthographic().clipAngle(90)
    const path = geoPath(projection, context)
    const graticule = geoGraticule()
    const rotation: [number, number] = [0, 0]

    let land: LandData | null = null
    let dots: Dot[] = []
    let baseRadius = 0
    let width = 0
    let height = 0
    let autoRotate = true

    // Fit the projection to the current container box (fills its width; the disc
    // is centred). Re-run on every resize via the ResizeObserver below.
    const resize = () => {
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      if (width === 0 || height === 0) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      baseRadius = Math.min(width, height) / 2.15
      projection.translate([width / 2, height / 2]).scale(baseRadius)
      render()
    }

    const render = () => {
      if (width === 0 || height === 0) return
      context.clearRect(0, 0, width, height)
      const scale = projection.scale()
      const scaleFactor = scale / baseRadius
      const cx = width / 2
      const cy = height / 2

      // Sea sphere: a radial gradient (lit teal centre → deep ink limb) reads as
      // a rounded ocean, with a soft teal-mint glow rim instead of a hard stroke.
      context.save()
      context.beginPath()
      context.arc(cx, cy, scale, 0, 2 * Math.PI)
      const ocean = context.createRadialGradient(cx, cy, scale * 0.2, cx, cy, scale)
      ocean.addColorStop(0, SEA)
      ocean.addColorStop(1, INK)
      context.fillStyle = ocean
      context.shadowColor = GLOW
      context.shadowBlur = 24 * scaleFactor
      context.fill()
      context.restore()

      if (!land) return

      // Graticule — faint sky meridians/parallels for the wireframe feel.
      context.beginPath()
      path(graticule())
      context.strokeStyle = SKY
      context.lineWidth = 1 * scaleFactor
      context.globalAlpha = 0.18
      context.stroke()
      context.globalAlpha = 1

      // Coastlines — a thin cream outline around each landmass.
      context.beginPath()
      for (const feature of land.features) path(feature)
      context.strokeStyle = CREAM
      context.lineWidth = 0.8 * scaleFactor
      context.globalAlpha = 0.55
      context.stroke()
      context.globalAlpha = 1

      // Land stipple — sky dots, clipped to the visible near hemisphere.
      context.fillStyle = SKY
      for (const dot of dots) {
        const projected = projection([dot.lng, dot.lat])
        if (!projected) continue
        const [px, py] = projected
        if (px < 0 || px > width || py < 0 || py > height) continue
        context.beginPath()
        context.arc(px, py, 1.1 * scaleFactor, 0, 2 * Math.PI)
        context.fill()
      }
      // #28 seam: draw destination markers here — same projection & rotation.
    }

    // --- interaction: drag to rotate, wheel to zoom ------------------------
    const onPointerDown = (event: PointerEvent) => {
      autoRotate = false
      const startX = event.clientX
      const startY = event.clientY
      const start: [number, number] = [rotation[0], rotation[1]]
      canvas.setPointerCapture(event.pointerId)

      const onMove = (move: PointerEvent) => {
        const sensitivity = 0.35
        rotation[0] = start[0] + (move.clientX - startX) * sensitivity
        rotation[1] = Math.max(-90, Math.min(90, start[1] - (move.clientY - startY) * sensitivity))
        projection.rotate(rotation)
        render()
      }
      const onUp = () => {
        canvas.removeEventListener('pointermove', onMove)
        canvas.removeEventListener('pointerup', onUp)
        autoRotate = true
      }
      canvas.addEventListener('pointermove', onMove)
      canvas.addEventListener('pointerup', onUp)
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const factor = event.deltaY > 0 ? 0.92 : 1.08
      const next = Math.max(baseRadius * 0.7, Math.min(baseRadius * 2.5, projection.scale() * factor))
      projection.scale(next)
      render()
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    // Idle auto-rotation. The parent only mounts this component when motion is
    // allowed, so the timer is unconditional here; drag pauses it, release
    // resumes it.
    const spin = timer(() => {
      if (!autoRotate) return
      rotation[0] += AUTO_ROTATE_SPEED
      projection.rotate(rotation)
      render()
    })

    let active = true
    fetch('/geo/ne_110m_land.json')
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('geo'))))
      .then((data: LandData) => {
        if (!active) return
        land = data
        dots = data.features.flatMap((feature) => generateDots(feature))
        setReady(true)
        render()
      })
      .catch(() => {
        // Leave the plain sea sphere spinning; the hero photo scrim carries the
        // content regardless, so a missing/blocked map is a soft degrade.
      })

    resize()

    return () => {
      active = false
      spin.stop()
      resizeObserver.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <div ref={containerRef} className={className}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
        style={{ opacity: ready ? 1 : 0, transition: 'opacity 600ms ease' }}
      />
    </div>
  )
}
