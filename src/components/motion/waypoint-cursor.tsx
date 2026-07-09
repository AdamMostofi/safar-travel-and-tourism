'use client'

import { useEffect, useRef, useState } from 'react'

import { shouldEnableCursor } from '@/lib/cursor'

/** Interactive targets that trigger the "lock-on" hover state. */
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, label'

/** How aggressively the marker chases the pointer each frame (0–1); higher = snappier, less trail. */
const LERP = 0.6

/**
 * Desktop "waypoint" cursor (issue #25). Hides the native cursor and renders a
 * small downward map-waypoint marker that trails the pointer via
 * `requestAnimationFrame` (a gentle lerp gives it a slight wake), and locks on —
 * scaling, righting itself and shifting to the action accent — over interactive
 * elements.
 *
 * It is a fine-pointer, desktop flourish, so it disables itself entirely on
 * coarse (touch) pointers and under `prefers-reduced-motion`, restoring the
 * native cursor. Both are read live via `matchMedia` (see `shouldEnableCursor`),
 * so plugging in a mouse or flipping the OS setting takes effect without a
 * reload. The layer is `pointer-events: none`, so real clicks, focus, text
 * selection and accessibility are never touched.
 */
export function WaypointCursor() {
  const [enabled, setEnabled] = useState(false)
  const layerRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<SVGSVGElement>(null)

  // Resolve (and live-track) whether the cursor should run at all.
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    const resolve = () =>
      setEnabled(
        shouldEnableCursor({ coarsePointer: coarse.matches, reducedMotion: reduced.matches }),
      )

    resolve()
    coarse.addEventListener('change', resolve)
    reduced.addEventListener('change', resolve)

    return () => {
      coarse.removeEventListener('change', resolve)
      reduced.removeEventListener('change', resolve)
    }
  }, [])

  // Drive the trailing marker + lock-on state while enabled.
  useEffect(() => {
    if (!enabled) return

    const layer = layerRef.current
    const marker = markerRef.current
    if (!layer || !marker) return

    // Hide the native cursor site-wide while the custom one is live.
    document.documentElement.classList.add('waypoint-cursor-active')

    // Target follows the pointer; current lerps toward it for the trailing feel.
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const current = { x: target.x, y: target.y }
    let visible = false
    let frame = 0

    const onPointerMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
      if (!visible) {
        // Snap into place on first move so it doesn't streak in from the centre.
        current.x = target.x
        current.y = target.y
        visible = true
        layer.style.opacity = '1'
      }
      const overInteractive = Boolean((event.target as Element | null)?.closest(INTERACTIVE_SELECTOR))
      marker.dataset.lock = overInteractive ? 'true' : 'false'
    }

    // Fade out when the pointer leaves the window (e.g. into browser chrome).
    const onPointerLeave = () => {
      visible = false
      layer.style.opacity = '0'
    }

    const tick = () => {
      current.x += (target.x - current.x) * LERP
      current.y += (target.y - current.y) * LERP
      layer.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
      document.documentElement.classList.remove('waypoint-cursor-active')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={layerRef} className="waypoint-cursor" style={{ opacity: 0 }} aria-hidden="true">
      {/* Triangular pointer; its sharp top-left tip is the true pointer hotspot. */}
      <svg
        ref={markerRef}
        className="waypoint-cursor__marker"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        data-lock="false"
      >
        <path d="M2.5 2 L2.5 19.5 L8.5 14.5 L14.5 20 L18 17 L11.5 11.5 L19 11 Z" className="waypoint-cursor__body" />
      </svg>
    </div>
  )
}
