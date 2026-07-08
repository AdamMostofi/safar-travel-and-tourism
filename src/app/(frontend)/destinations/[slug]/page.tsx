import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { DetailHero } from '@/components/detail-hero'
import { PackageGrid } from '@/components/cards/package-grid'
import { RevealOnScroll } from '@/components/motion'
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
      <DetailHero
        image={destination.heroImage}
        title={destination.name}
        eyebrow={
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky">
            Destination
          </p>
        }
      />

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
