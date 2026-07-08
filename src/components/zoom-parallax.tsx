'use client'

import { useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'motion/react'

import type { DestinationListItem } from '@/server/destinations'

gsap.registerPlugin(ScrollTrigger)

/**
 * "Top Destinations" as a zoom-parallax band (issue #12): each Destination
 * photo scales gently as it scrolls through the viewport — at slightly
 * different rates per tile for a layered, cinematic feel — replacing the flat
 * tile grid. Each still links to its Destination page.
 *
 * The scroll-linked zoom is a vestibular effect (same family as Parallax /
 * Ken-Burns), so under `prefers-reduced-motion` the GSAP timeline is skipped and
 * the images hold still (ADR-0004, "graceful, not static").
 */
export function ZoomParallax({
  destinations,
}: {
  destinations: DestinationListItem[]
}) {
  const reducedMotion = Boolean(useReducedMotion())
  const rootRef = useRef<HTMLUListElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion) return
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-zoom]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 1 },
          {
            scale: 1.14 + (i % 3) * 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    }, root)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <ul ref={rootRef} className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {destinations.map((destination) => (
        <li key={destination.id}>
          <Link
            href={`/destinations/${destination.slug}`}
            aria-label={`Explore ${destination.name}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-sea/40 via-sky/40 to-sand shadow-soft"
          >
            {destination.heroImage && (
              <div data-zoom className="absolute inset-0 will-change-transform">
                <Image
                  src={destination.heroImage.url}
                  alt={destination.heroImage.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            )}
            {/* Ink scrim so the name stays legible over any photo. */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <h3 className="absolute inset-x-0 bottom-0 p-5 font-display text-xl text-cream">
              {destination.name}
            </h3>
          </Link>
        </li>
      ))}
    </ul>
  )
}
