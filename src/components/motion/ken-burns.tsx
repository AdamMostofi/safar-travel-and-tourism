import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type KenBurnsProps = {
  /** The subject to drift — an <img>, background layer, or gradient panel. */
  children: ReactNode
  /** Classes for the clipping frame (set the height/rounding here). */
  className?: string
}

/**
 * Slow, cinematic pan/zoom over a hero subject — the image-only Ken-Burns of
 * the brand brief. The drift is pure CSS (`.animate-ken-burns`, 60fps) and is a
 * vestibular zoom, so `prefers-reduced-motion` holds it still (handled in
 * globals.css) while the surrounding reveals keep animating.
 */
export function KenBurns({ children, className }: KenBurnsProps) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <div className="animate-ken-burns h-full w-full">{children}</div>
    </div>
  )
}
