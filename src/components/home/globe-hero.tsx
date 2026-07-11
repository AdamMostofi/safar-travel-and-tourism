'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { shouldRenderLiveGlobe } from '@/lib/globe'
import { toWaypoints } from '@/lib/destinationCoords'
import type { MediaView } from '@/server/media'

/**
 * The interactive canvas globe is heavy (d3 + a per-frame Canvas 2D redraw), so
 * it is code-split and only pulled in on the client — never server-rendered and
 * never in the first-paint bundle. Until it loads (or when it never loads,
 * e.g. on the static-fallback path) a calm CSS sphere stands in.
 */
const GlobeCanvas = dynamic(() => import('./globe-canvas'), {
  ssr: false,
  loading: () => <GlobeBackdrop />,
})

type GlobeHeroProps = {
  /** The destination photo behind the fallback hero, if one is available. */
  image: MediaView | null
  /** Prebuilt `wa.me` link for the secondary "Talk to us" CTA, if configured. */
  whatsappHref: string | null
  /**
   * Featured destinations plotted as glowing waypoints on the live globe and,
   * always, as a visually-hidden link list for keyboard/screen-reader users.
   */
  destinations?: ReadonlyArray<{ name: string; slug: string }>
}

/**
 * The home hero: an interactive wireframe-dotted globe (issue #26) themed to
 * Ocean Breeze, over a deep-sea scrim, with the headline and the two CTAs.
 *
 * The live canvas globe is a desktop-first enhancement. On touch/coarse pointers,
 * low-power devices, or under `prefers-reduced-motion` (see `shouldRenderLiveGlobe`)
 * it steps aside for a *static* hero — the destination photo when we have one,
 * otherwise a CSS sea-glow globe — so the page stays fast and calm ("graceful,
 * not static", ADR-0004). The decision is resolved on the client and re-resolved
 * live via `matchMedia`, so plugging in a mouse or flipping the OS setting takes
 * effect without a reload. It defaults to the fallback on the server and first
 * paint, then upgrades — the content never depends on the canvas.
 */
export function GlobeHero({ image, whatsappHref, destinations = [] }: GlobeHeroProps) {
  const [live, setLive] = useState(false)
  // Only destinations we can place on the globe become markers; the sr-only
  // list below still links every destination regardless.
  const waypoints = toWaypoints(destinations)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    const resolve = () =>
      setLive(
        shouldRenderLiveGlobe({
          coarsePointer: coarse.matches,
          reducedMotion: reduced.matches,
          hardwareConcurrency: navigator.hardwareConcurrency,
        }),
      )

    resolve()
    coarse.addEventListener('change', resolve)
    reduced.addEventListener('change', resolve)

    return () => {
      coarse.removeEventListener('change', resolve)
      reduced.removeEventListener('change', resolve)
    }
  }, [])

  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-gradient-to-b from-ink via-ink to-sea/60">
      {/* Background layer: the live globe when enabled, else the static hero. */}
      <div className="absolute inset-0">
        {live ? (
          <GlobeCanvas className="h-full w-full" markers={waypoints} />
        ) : image ? (
          <Image src={image.url} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <GlobeBackdrop />
        )}
      </div>

      {/* Ink scrim so the light headline stays legible over the globe or photo. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/60 to-ink/40" />

      {/*
        The canvas globe is aria-hidden and its waypoints are unreachable by
        keyboard, so mirror them as a visually-hidden link list. Rendered on
        BOTH the live and fallback paths, so the destination links are never
        lost. Uses every destination, not just the placeable ones.
      */}
      {destinations.length > 0 && (
        <nav aria-label="Featured destinations" className="sr-only">
          <ul>
            {destinations.map((destination) => (
              <li key={destination.slug}>
                <Link href={`/destinations/${destination.slug}`}>{destination.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="relative mx-auto w-full max-w-content px-6 text-center">
        <p className="font-body text-sm uppercase tracking-[0.2em] text-sky">
          Safar · سفر - your journey
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-tight text-cream sm:text-6xl">
          Journeys worth taking, crafted by people who&apos;ve done this for 20 years.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-cream/85">
          A trusted Beirut travel agency making global travel feel accessible -
          from budget regional trips to premium long-haul escapes.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/packages">Browse Packages</Link>
          </Button>
          {whatsappHref && (
            <WhatsAppButton href={whatsappHref} className="border-cream text-cream hover:bg-cream/10">
              Talk to us
            </WhatsAppButton>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * A lightweight, dependency-free CSS sphere — the loading placeholder for the
 * code-split canvas and the imageless static fallback. A soft sea-glow disc with
 * a teal-mint rim echoes the live globe without any JS.
 */
function GlobeBackdrop() {
  return (
    <div className="relative h-full w-full" aria-hidden="true">
      <div
        className="absolute left-1/2 top-1/2 aspect-square w-[min(80vw,80svh)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 40%, var(--sea) 0%, var(--ink) 70%)',
          boxShadow: '0 0 120px 24px rgba(94, 234, 212, 0.25)',
        }}
      />
    </div>
  )
}
