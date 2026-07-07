'use client'

import type { ReactNode } from 'react'
import { motion } from 'motion/react'

type HoverLiftProps = {
  children: ReactNode
  className?: string
}

/**
 * Lifts a card softly on hover/focus — the "floating cards" of the brand brief.
 * This is an intent-driven micro-interaction (not a scroll-vestibular effect),
 * so it is kept under reduced motion. Pair with `shadow-soft`/`shadow-lift`.
 */
export function HoverLift({ children, className }: HoverLiftProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -6 }}
      whileFocus={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {children}
    </motion.div>
  )
}
