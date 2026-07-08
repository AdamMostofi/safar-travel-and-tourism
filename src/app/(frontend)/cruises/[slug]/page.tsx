import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { DetailHero } from '@/components/detail-hero'
import { Gallery } from '@/components/gallery'
import { RevealOnScroll } from '@/components/motion'
import { getCruiseBySlug } from '@/server/cruises'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const cruise = await getCruiseBySlug(slug)
  if (!cruise) return { title: 'Cruise not found' }
  return {
    title: cruise.title,
    description: cruise.information.slice(0, 155),
  }
}

export default async function CruiseDetailPage({ params }: Params) {
  const { slug } = await params
  const cruise = await getCruiseBySlug(slug)

  if (!cruise) notFound()

  return (
    <article>
      <DetailHero
        image={cruise.heroImage}
        title={cruise.title}
        captionClassName="max-w-3xl"
        eyebrow={
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky">
            {cruise.country}
          </p>
        }
      />

      <div className="mx-auto max-w-3xl px-6 py-section">
        <Link href="/cruises" className="text-sm text-sea hover:underline">
          ← All Cruises
        </Link>

        <RevealOnScroll>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 rounded-2xl bg-card p-6 shadow-soft">
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink/60">Country</dt>
              <dd className="mt-1 font-medium text-ink">{cruise.country}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink/60">Duration</dt>
              <dd className="mt-1 font-medium text-ink">{cruise.duration}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink/60">
                Starting Price
              </dt>
              <dd className="mt-1 font-display text-lg text-coral">
                Starting ${cruise.startingPrice}
              </dd>
            </div>
          </dl>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08}>
          <p className="mt-8 whitespace-pre-line leading-relaxed text-ink/80">
            {cruise.information}
          </p>
        </RevealOnScroll>

        {cruise.gallery.length > 0 && (
          <RevealOnScroll delay={0.08}>
            <section className="mt-12">
              <h2 className="font-display text-2xl text-ink">Gallery</h2>
              <div className="mt-4">
                <Gallery images={cruise.gallery} />
              </div>
            </section>
          </RevealOnScroll>
        )}
      </div>
    </article>
  )
}
