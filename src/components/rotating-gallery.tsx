'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { resolveSwipe } from '@/lib/swipe'
import { cn } from '@/lib/utils'

export type GalleryItem = {
  src: string
  alt: string
  /** Small kicker over the caption (e.g. the country). */
  label?: string
  /** Headline caption on the active slide (e.g. the trip title). */
  caption?: string
  /** Optional link — renders a "View" CTA on the active slide. */
  href?: string
}

/**
 * A cinematic rotating gallery (issue #12, adapted from the bookmarked 21st
 * component): the active image sits centre while the neighbours tilt and dim to
 * the sides. Used for the home "Featured journeys" showcase (slides link to
 * their trip) and the Package/Cruise detail galleries (photos only).
 *
 * Adapted to the Sea/Ocean Breeze palette and `next/image`, with a gentle tilt
 * instead of the original 180° flip, and `prefers-reduced-motion` support — the
 * slides snap between positions with no sliding/rotation when motion is reduced.
 */
export function RotatingGallery({
  items,
  className,
}: {
  items: GalleryItem[]
  className?: string
}) {
  const reducedMotion = Boolean(useReducedMotion())
  const [current, setCurrent] = useState(0)

  if (items.length === 0) return null

  const prev = () => setCurrent((i) => (i === 0 ? items.length - 1 : i - 1))
  const next = () => setCurrent((i) => (i === items.length - 1 ? 0 : i + 1))

  // Touch/pointer swipe: record where a horizontal drag starts, then resolve the
  // travel into prev/next on release. `touch-pan-y` on the container leaves
  // vertical page scroll to the browser, so this never traps the scroll.
  const swipeStartX = useRef<number | null>(null)
  const onSwipeStart = (e: React.PointerEvent) => {
    swipeStartX.current = e.clientX
  }
  const onSwipeEnd = (e: React.PointerEvent) => {
    if (swipeStartX.current === null) return
    const intent = resolveSwipe(e.clientX - swipeStartX.current)
    swipeStartX.current = null
    if (intent === 'prev') prev()
    else if (intent === 'next') next()
  }

  const positionOf = (index: number): 'center' | 'left' | 'right' | 'hidden' => {
    if (index === current) return 'center'
    if (index === (current - 1 + items.length) % items.length) return 'left'
    if (index === (current + 1) % items.length) return 'right'
    return 'hidden'
  }

  const variants = {
    center: { x: '0%', scale: 1, rotate: 0, opacity: 1, zIndex: 10 },
    left: { x: '-62%', scale: 0.82, rotate: -6, opacity: 0.5, zIndex: 5 },
    right: { x: '62%', scale: 0.82, rotate: 6, opacity: 0.5, zIndex: 5 },
    hidden: { x: '0%', scale: 0.6, rotate: 0, opacity: 0, zIndex: 0 },
  }

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Gallery"
      onPointerDown={onSwipeStart}
      onPointerUp={onSwipeEnd}
      className={cn(
        // `svh` keeps the height stable as mobile browser chrome shows/hides.
        'relative flex h-[54svh] min-h-[360px] w-full touch-pan-y items-center justify-center overflow-hidden md:h-[560px]',
        className,
      )}
    >
      {items.map((item, index) => {
        const position = positionOf(index)
        const isActive = position === 'center'

        return (
          <motion.div
            key={`${item.src}-${index}`}
            initial={false}
            animate={position}
            variants={variants}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            className={cn(
              'absolute h-full w-[86vw] overflow-hidden rounded-3xl shadow-lift md:w-[680px]',
              position === 'left' || position === 'right' ? 'cursor-pointer' : '',
              position === 'hidden' && 'pointer-events-none',
            )}
            onClick={() => {
              if (position === 'left') prev()
              if (position === 'right') next()
            }}
            aria-hidden={!isActive}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 86vw, 680px"
              className="object-cover"
              priority={index === 0}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />

            {(item.label || item.caption || item.href) && (
              <motion.div
                initial={false}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 12 }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
                className="absolute inset-x-6 bottom-20 z-10 text-cream md:bottom-24 md:inset-x-10"
              >
                {item.label && (
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-cream/80">
                    {item.label}
                  </p>
                )}
                {item.caption && (
                  <h3 className="max-w-xl font-display text-2xl leading-tight md:text-4xl">
                    {item.caption}
                  </h3>
                )}
                {item.href && isActive && (
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex items-center gap-1 rounded-full bg-cream px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-cream/90"
                  >
                    View this trip →
                  </Link>
                )}
              </motion.div>
            )}
          </motion.div>
        )
      })}

      <div className="absolute bottom-5 z-20 flex gap-3 md:bottom-6">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous"
          className="flex size-12 items-center justify-center rounded-full bg-cream/90 text-ink shadow-lift backdrop-blur transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea"
        >
          <ChevronLeft className="size-6" aria-hidden />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next"
          className="flex size-12 items-center justify-center rounded-full bg-cream/90 text-ink shadow-lift backdrop-blur transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea"
        >
          <ChevronRight className="size-6" aria-hidden />
        </button>
      </div>
    </div>
  )
}
