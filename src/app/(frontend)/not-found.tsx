import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { HeroGradient } from '@/components/hero-gradient'
import { KenBurns, RevealOnScroll } from '@/components/motion'

export const metadata: Metadata = {
  title: 'Not found',
}

/**
 * The frontend not-found page — reached for unknown Package/Destination slugs
 * (`notFound()`) and any stray URL. Keeps the Sea & Sand look and points back
 * to the two main browsing entries.
 */
export default function NotFound() {
  return (
    <div className="relative">
      <KenBurns className="h-[38svh] min-h-[240px] w-full">
        <HeroGradient className="bg-gradient-to-br from-sea/25 via-sky/40 to-sand" />
      </KenBurns>
      <div className="mx-auto max-w-content px-6 py-section text-center">
        <RevealOnScroll>
          <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">
            Page not found
          </p>
          <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
            We couldn&apos;t find that page.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-ink/70">
            The trip you&apos;re looking for may have moved. Browse our Packages and
            Destinations, or head back home.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/packages">Browse Packages</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/destinations">Explore Destinations</Link>
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  )
}
