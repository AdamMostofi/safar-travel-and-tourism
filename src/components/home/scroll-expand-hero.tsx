'use client'

import { useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { HeroGradient } from '@/components/hero-gradient'
import { scrollExpandEnabled } from '@/lib/motion'
import type { MediaView } from '@/server/media'

gsap.registerPlugin(ScrollTrigger)

type ScrollExpandHeroProps = {
  /** The destination photo behind the headline, if one is available. */
  image: MediaView | null
  /** Prebuilt `wa.me` link for the secondary "Talk to us" CTA, if configured. */
  whatsappHref: string | null
}

/**
 * The home hero: a destination photo that starts as a contained rounded card
 * and expands to full-bleed as the visitor scrolls the hero through the
 * viewport — an immersive "scroll to expand" reveal (issue #12, adapted from the
 * bookmarked 21st component to work with the site's Lenis smooth-scroll and the
 * reduced-motion policy, rather than hijacking page scroll).
 *
 * The expansion is a scroll-linked (vestibular) effect scrubbed by GSAP
 * ScrollTrigger, kept in step with Lenis. Under `prefers-reduced-motion` the
 * media is held fully expanded and the hero renders static — the headline and
 * CTAs stay visible throughout (ADR-0004, "graceful, not static").
 */
export function ScrollExpandHero({ image, whatsappHref }: ScrollExpandHeroProps) {
  const reducedMotion = Boolean(useReducedMotion())
  const expand = scrollExpandEnabled(reducedMotion)
  const sectionRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!expand) return
    const section = sectionRef.current
    const frame = frameRef.current
    if (!section || !frame) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame,
        { width: '74vw', height: '66vh', borderRadius: 28 },
        {
          width: '100vw',
          height: '100vh',
          borderRadius: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [expand])

  return (
    <section ref={sectionRef} className={expand ? 'relative h-[180vh]' : 'relative'}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div
          ref={frameRef}
          className="relative overflow-hidden shadow-lift"
          style={
            expand
              ? { width: '74vw', height: '66vh', borderRadius: 28 }
              : { width: '100vw', height: '100vh', borderRadius: 0 }
          }
        >
          {image ? (
            <Image
              src={image.url}
              alt={image.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <HeroGradient className="bg-gradient-to-br from-sea/40 via-sky/40 to-sand" glow />
          )}
          {/* Ink scrim so the light headline stays legible over any photo. */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/55 to-ink/40" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="font-body text-sm uppercase tracking-[0.2em] text-sky">
              Safar · سفر — your journey
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-cream sm:text-6xl">
              Journeys worth taking, crafted by people who&apos;ve done this for 20 years.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-cream/85">
              A trusted Beirut travel agency making global travel feel accessible —
              from budget regional trips to premium long-haul escapes.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/packages">Browse Packages</Link>
              </Button>
              {whatsappHref && (
                <WhatsAppButton
                  href={whatsappHref}
                  className="border-cream text-cream hover:bg-cream/10"
                >
                  Talk to us
                </WhatsAppButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
