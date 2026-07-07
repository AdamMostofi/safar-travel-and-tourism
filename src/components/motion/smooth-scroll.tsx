'use client'

import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'motion/react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Wires Lenis smooth (momentum) scrolling for the whole site and syncs it with
 * GSAP ScrollTrigger so parallax/scroll scenes stay in step with the smoothed
 * scroll position.
 *
 * Smooth scrolling is a large vestibular effect, so visitors who prefer reduced
 * motion get native scrolling instead — the rest of the page keeps its gentle
 * fades ("graceful, not static").
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis()

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [reducedMotion])

  return <>{children}</>
}
