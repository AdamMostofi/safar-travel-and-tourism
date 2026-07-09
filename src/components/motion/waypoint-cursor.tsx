'use client'

import { useEffect, useRef, useState } from 'react'

import { shouldEnableCursor } from '@/lib/cursor'

/** Interactive targets that trigger the "lock-on" hover state. */
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, label'

/** Rendered size (px) of the arrow; the SVG viewBox is 32. */
const CURSOR_SIZE = 22
/** Radians → degrees. */
const DEG = 57.296

/**
 * Desktop custom cursor (issue #25): a rounded arrow pointer that tracks the
 * mouse 1:1 and rotates to face the direction of travel (adapted from the
 * "curzr" arrow pointer), re-tinted to the Ocean Breeze palette. It locks on —
 * a sky-blue fill with a soft green glow — over interactive elements.
 *
 * A fine-pointer, desktop flourish: it disables itself entirely on coarse
 * (touch) pointers and under `prefers-reduced-motion`, restoring the native
 * cursor. Both are read live via `matchMedia` (see `shouldEnableCursor`), so
 * plugging in a mouse or flipping the OS setting takes effect without a reload.
 * The layer is `pointer-events: none`, so clicks, focus, selection and
 * accessibility are never touched.
 */
export function WaypointCursor() {
  const [enabled, setEnabled] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

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

  // Drive the arrow: follow the pointer and rotate toward the direction of travel.
  useEffect(() => {
    if (!enabled) return
    const cursor = cursorRef.current
    if (!cursor) return

    document.documentElement.classList.add('waypoint-cursor-active')

    let prevX = 0
    let prevY = 0
    let angle = 0
    let previousAngle = 0
    let angleDisplace = 0 // accumulated so the arrow spins continuously (never flips)
    let visible = false

    // Nudge the element's anchor per quadrant so the arrow's tip — not its
    // centre — leads the direction of travel.
    const anchor = (modAngle: number) => {
      if (modAngle >= 45 && modAngle < 135) {
        cursor.style.left = `${-CURSOR_SIZE}px`
        cursor.style.top = `${-CURSOR_SIZE / 2}px`
      } else if (modAngle >= 135 && modAngle < 225) {
        cursor.style.left = `${-CURSOR_SIZE / 2}px`
        cursor.style.top = `${-CURSOR_SIZE}px`
      } else if (modAngle >= 225 && modAngle < 315) {
        cursor.style.left = '0px'
        cursor.style.top = `${-CURSOR_SIZE / 2}px`
      } else {
        cursor.style.left = `${-CURSOR_SIZE / 2}px`
        cursor.style.top = '0px'
      }
    }

    const onMove = (event: PointerEvent) => {
      const x = event.clientX
      const y = event.clientY
      const dx = prevX - x
      const dy = prevY - y
      prevX = x
      prevY = y

      if (!visible) {
        visible = true
        cursor.style.opacity = '1'
      }
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`

      if (Math.hypot(dx, dy) > 1) {
        previousAngle = angle
        const unsorted = Math.atan(Math.abs(dy) / Math.abs(dx)) * DEG
        if (dx <= 0 && dy >= 0) angle = 90 - unsorted
        else if (dx < 0 && dy < 0) angle = unsorted + 90
        else if (dx >= 0 && dy <= 0) angle = 90 - unsorted + 180
        else angle = unsorted + 270

        if (Number.isNaN(angle)) {
          angle = previousAngle
        } else {
          const delta = angle - previousAngle
          if (delta <= -270) angleDisplace += 360 + delta
          else if (delta >= 270) angleDisplace += delta - 360
          else angleDisplace += delta
        }
        cursor.style.transform += ` rotate(${angleDisplace}deg)`
        const modAngle = angleDisplace >= 0 ? angleDisplace % 360 : 360 + (angleDisplace % 360)
        anchor(modAngle)
      } else {
        cursor.style.transform += ` rotate(${angleDisplace}deg)`
      }

      cursor.dataset.lock = (event.target as Element | null)?.closest(INTERACTIVE_SELECTOR)
        ? 'true'
        : 'false'
    }

    // Fade out when the pointer leaves the window (e.g. into browser chrome).
    const onLeave = () => {
      visible = false
      cursor.style.opacity = '0'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('waypoint-cursor-active')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      className="waypoint-cursor"
      style={{ opacity: 0 }}
      data-lock="false"
      aria-hidden="true"
    >
      <svg width={CURSOR_SIZE} height={CURSOR_SIZE} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path
          className="waypoint-cursor__inner"
          d="M25,30a5.82,5.82,0,0,1-1.09-.17l-.2-.07-7.36-3.48a.72.72,0,0,0-.35-.08.78.78,0,0,0-.33.07L8.24,29.54a.66.66,0,0,1-.2.06,5.17,5.17,0,0,1-1,.15,3.6,3.6,0,0,1-3.29-5L12.68,4.2a3.59,3.59,0,0,1,6.58,0l9,20.74A3.6,3.6,0,0,1,25,30Z"
        />
        <path
          className="waypoint-cursor__outer"
          d="M16,3A2.59,2.59,0,0,1,18.34,4.6l9,20.74A2.59,2.59,0,0,1,25,29a5.42,5.42,0,0,1-.86-.15l-7.37-3.48a1.84,1.84,0,0,0-.77-.17,1.69,1.69,0,0,0-.73.16l-7.4,3.31a5.89,5.89,0,0,1-.79.12,2.59,2.59,0,0,1-2.37-3.62L13.6,4.6A2.58,2.58,0,0,1,16,3m0-2h0A4.58,4.58,0,0,0,11.76,3.8L2.84,24.33A4.58,4.58,0,0,0,7,30.75a6.08,6.08,0,0,0,1.21-.17,1.87,1.87,0,0,0,.4-.13L16,27.18l7.29,3.44a1.64,1.64,0,0,0,.39.14A6.37,6.37,0,0,0,25,31a4.59,4.59,0,0,0,4.21-6.41l-9-20.75A4.62,4.62,0,0,0,16,1Z"
        />
      </svg>
    </div>
  )
}
