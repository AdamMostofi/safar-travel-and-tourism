'use client'

import { useEffect, useRef, useState } from 'react'

import { shouldEnableCursor } from '@/lib/cursor'

/** Interactive targets that trigger the "lock-on" hover state. */
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, label'

/**
 * Desktop "waypoint" cursor (issue #25). Hides the native cursor and renders a
 * small 3D-beveled triangular pointer that tracks the pointer 1:1 (positioned
 * directly on each `pointermove`, so it never lags), and locks on — growing with
 * a soft green glow — over interactive elements.
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

    let visible = false

    const onPointerMove = (event: PointerEvent) => {
      // Position directly on the pointer event — no rAF/lerp — so the cursor
      // tracks 1:1 with zero latency and never contends with the globe's
      // animation frame (which is what made it feel laggy in the hero).
      layer.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      if (!visible) {
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

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
      document.documentElement.classList.remove('waypoint-cursor-active')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={layerRef} className="waypoint-cursor" style={{ opacity: 0 }} aria-hidden="true">
      {/* 3D-beveled triangular pointer; its sharp top tip is the pointer hotspot.
          Two facets (lit left, shaded right) over a themed silver-blue gradient
          give it depth, tinted toward the Ocean Breeze sky/cream palette. */}
      <svg
        ref={markerRef}
        className="waypoint-cursor__marker"
        width="24"
        height="30"
        viewBox="0 0 24 30"
        data-lock="false"
      >
        <defs>
          <linearGradient id="wc-left" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eef7fc" />
            <stop offset="1" stopColor="#aec8d8" />
          </linearGradient>
          <linearGradient id="wc-right" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor="#d7e9f4" />
            <stop offset="1" stopColor="#5d7c92" />
          </linearGradient>
        </defs>
        {/* right (shaded) facet */}
        <path d="M5 2 L10 24 L21 27 Z" fill="url(#wc-right)" />
        {/* left (lit) facet */}
        <path d="M5 2 L5 24 L10 24 Z" fill="url(#wc-left)" />
        {/* crisp outline for definition on any background */}
        <path
          d="M5 2 L5 24 L21 27 Z"
          fill="none"
          stroke="#3f566a"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
