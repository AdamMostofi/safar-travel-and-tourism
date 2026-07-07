'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'motion/react'

import { parallaxFactor } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)

type ParallaxProps = {
  children: ReactNode
  className?: string
  /**
   * Fraction of the scrolled distance the layer drifts by. Positive moves the
   * layer up as you scroll down (background feel); ~0.15–0.35 reads as depth.
   */
  factor?: number
}

/**
 * Light parallax drift on scroll via GSAP ScrollTrigger. Parallax is a large
 * vestibular movement, so under reduced motion the factor collapses to 0 (see
 * `parallaxFactor`) and the layer sits still.
 */
export function Parallax({ children, className, factor = 0.2 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const effectiveFactor = parallaxFactor(factor, Boolean(reducedMotion))

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || effectiveFactor === 0) return

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: -effectiveFactor * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [effectiveFactor])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
