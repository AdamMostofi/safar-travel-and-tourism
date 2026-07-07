'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { revealOffset } from '@/lib/motion'

type RevealOnScrollProps = {
  children: ReactNode
  className?: string
  /** Stagger delay in seconds, for revealing a list item after its siblings. */
  delay?: number
}

/**
 * Fades and gently rises content in as it scrolls into view (once). Under
 * reduced motion the fade is kept but the rise is eased to zero (see
 * `revealOffset`), so the content still appears softly rather than snapping in.
 */
export function RevealOnScroll({ children, className, delay = 0 }: RevealOnScrollProps) {
  const reducedMotion = useReducedMotion()
  const y = revealOffset(Boolean(reducedMotion))

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
