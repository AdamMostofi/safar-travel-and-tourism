'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'

import { resolveSwipe } from '@/lib/swipe'
import { cn } from '@/lib/utils'
import type { TestimonialView } from '@/server/testimonials'

/** First initials of a name, for the avatar fallback. */
const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

/**
 * The testimonials carousel (issue #12): one traveller quote at a time with a
 * rating, author, and photo (or initials), and prev/next + dot controls. Motion
 * is `prefers-reduced-motion`-aware — the quote cross-fades quickly with no
 * vertical travel when motion is reduced.
 */
export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: TestimonialView[]
}) {
  const reducedMotion = Boolean(useReducedMotion())
  const [index, setIndex] = useState(0)

  if (testimonials.length === 0) return null

  const active = testimonials[index]
  const prev = () => setIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1))
  const next = () => setIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1))

  // Touch/pointer swipe (mirrors the rotating gallery): resolve a horizontal
  // drag into prev/next. `touch-pan-y` leaves vertical page scroll untouched.
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

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Traveller testimonials"
      className="relative mx-auto max-w-3xl"
    >
      <div
        onPointerDown={onSwipeStart}
        onPointerUp={onSwipeEnd}
        className="relative touch-pan-y overflow-hidden rounded-3xl bg-card p-8 shadow-soft sm:p-12"
      >
        <Quote className="size-10 text-sea/30" aria-hidden />

        <AnimatePresence mode="wait">
          <motion.blockquote
            key={active.id}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.35, ease: 'easeOut' }}
          >
            <p className="mt-4 font-display text-xl leading-relaxed text-ink sm:text-2xl">
              &ldquo;{active.quote}&rdquo;
            </p>

            {active.rating != null && (
              <span
                role="img"
                aria-label={`Rated ${active.rating} out of 5`}
                className="mt-6 flex gap-1"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'size-5',
                      i < active.rating! ? 'fill-gold text-gold' : 'text-border',
                    )}
                    aria-hidden
                  />
                ))}
              </span>
            )}

            <footer className="mt-6 flex items-center gap-4">
              {active.avatar ? (
                <Image
                  src={active.avatar.url}
                  alt={active.avatar.alt}
                  width={48}
                  height={48}
                  className="size-12 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex size-12 items-center justify-center rounded-full bg-sea font-display text-sm text-cream"
                >
                  {initials(active.authorName)}
                </span>
              )}
              <div>
                <p className="font-medium text-ink">{active.authorName}</p>
                <p className="text-sm text-ink/70">
                  {[active.authorLocation, active.trip].filter(Boolean).join(' · ')}
                </p>
              </div>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous testimonial"
          className="flex size-11 items-center justify-center rounded-full border border-border bg-card text-ink transition-colors hover:border-sea hover:text-sea focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>

        <ul className="flex gap-2">
          {testimonials.map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  'size-2.5 rounded-full transition-colors',
                  i === index ? 'bg-sea' : 'bg-border hover:bg-sea/50',
                )}
              />
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={next}
          aria-label="Next testimonial"
          className="flex size-11 items-center justify-center rounded-full border border-border bg-card text-ink transition-colors hover:border-sea hover:text-sea focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  )
}
