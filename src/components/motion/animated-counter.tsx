'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

type AnimatedCounterProps = {
  /** The final value to count up to (e.g. 20, 150). */
  value: number
  /** Optional text before/after the number, e.g. suffix "+" or "yrs". */
  prefix?: string
  suffix?: string
  /** Count-up duration in seconds. */
  duration?: number
  className?: string
}

/**
 * A proof-metric counter that counts up from 0 to `value` when scrolled into
 * view. It is a delight touch, not vestibular, so it still runs under reduced
 * motion — but there it jumps straight to the final value rather than ticking.
 */
export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1.6,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reducedMotion = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return

    if (reducedMotion) {
      setDisplay(value)
      return
    }

    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1)
      // Ease-out so it decelerates into the final figure.
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [inView, reducedMotion, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
