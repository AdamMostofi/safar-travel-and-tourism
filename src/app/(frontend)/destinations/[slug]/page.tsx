import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PackageGrid } from '@/components/cards/package-grid'
import { HeroGradient } from '@/components/hero-gradient'
import { KenBurns, RevealOnScroll } from '@/components/motion'
import { getDestinationBySlug } from '@/server/destinations'
import { listPackagesByDestination } from '@/server/packages'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)
  if (!destination) return { title: 'Destination not found' }
  return {
    title: destination.name,
    description: `Browse Safar Packages to ${destination.name}.`,
  }
}

export default async function DestinationDetailPage({ params }: Params) {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)

  if (!destination) notFound()

  const packages = await listPackagesByDestination(slug)

  return (
    <article>
      {/* Photographic hero over a Sea & Sand gradient fallback. */}
      <div className="relative">
        <KenBurns className="h-[42vh] min-h-[280px] w-full">
          {destination.heroImage ? (
            <Image
              src={destination.heroImage.url}
              alt={destination.heroImage.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <HeroGradient className="bg-gradient-to-br from-sea/25 via-sky/40 to-sand" />
          )}
        </KenBurns>
        {/* Ink scrim keeps the title legible over any photo. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-content px-6 pb-8">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky">
                Destination
              </p>
              <h1 className="mt-2 font-display text-4xl text-cream sm:text-5xl">
                {destination.name}
              </h1>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-6 py-section">
        <Link href="/destinations" className="text-sm text-sea hover:underline">
          ← All Destinations
        </Link>

        {packages.length === 0 ? (
          <p className="mt-8 text-lg text-ink/70">
            No Packages to {destination.name} just yet — {' '}
            <Link href="/packages" className="text-sea hover:underline">
              browse all Packages
            </Link>
            .
          </p>
        ) : (
          <div className="mt-8">
            <RevealOnScroll>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                Packages to {destination.name}
              </h2>
            </RevealOnScroll>
            <div className="mt-8">
              <PackageGrid packages={packages} />
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
