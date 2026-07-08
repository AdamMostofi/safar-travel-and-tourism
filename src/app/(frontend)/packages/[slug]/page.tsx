import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check } from 'lucide-react'

import { DetailHero } from '@/components/detail-hero'
import { EnquirySection } from '@/components/enquiry/enquiry-section'
import { Gallery } from '@/components/gallery'
import { RevealOnScroll } from '@/components/motion'
import { getPackageBySlug } from '@/server/packages'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const pkg = await getPackageBySlug(slug)
  if (!pkg) return { title: 'Package not found' }
  return {
    title: pkg.title,
    description: pkg.information.slice(0, 155),
  }
}

export default async function PackageDetailPage({ params }: Params) {
  const { slug } = await params
  const pkg = await getPackageBySlug(slug)

  if (!pkg) notFound()

  const kicker = 'text-sm font-medium uppercase tracking-[0.2em] text-sky'

  return (
    <article>
      <DetailHero
        image={pkg.heroImage}
        title={pkg.title}
        captionClassName="max-w-3xl"
        eyebrow={
          pkg.destination ? (
            <Link href={`/destinations/${pkg.destination.slug}`} className={`${kicker} hover:underline`}>
              {pkg.country}
            </Link>
          ) : (
            <p className={kicker}>{pkg.country}</p>
          )
        }
      />

      <div className="mx-auto max-w-3xl px-6 py-section">
        <Link href="/packages" className="text-sm text-sea hover:underline">
          ← All Packages
        </Link>

        <RevealOnScroll>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 rounded-2xl bg-card p-6 shadow-soft">
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink/60">Country</dt>
              <dd className="mt-1 font-medium text-ink">{pkg.country}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink/60">Duration</dt>
              <dd className="mt-1 font-medium text-ink">{pkg.duration}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink/60">
                Starting Price
              </dt>
              <dd className="mt-1 font-display text-lg text-coral">
                Starting ${pkg.startingPrice}
              </dd>
            </div>
          </dl>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08}>
          <p className="mt-8 whitespace-pre-line leading-relaxed text-ink/80">
            {pkg.information}
          </p>
        </RevealOnScroll>

        {pkg.inclusions.length > 0 && (
          <RevealOnScroll delay={0.08}>
            <section className="mt-12">
              <h2 className="font-display text-2xl text-ink">What&apos;s included</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {pkg.inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-ink/80">
                    <Check className="mt-0.5 size-5 shrink-0 text-sea" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </RevealOnScroll>
        )}

        {pkg.gallery.length > 0 && (
          <RevealOnScroll delay={0.08}>
            <section className="mt-12">
              <h2 className="font-display text-2xl text-ink">Gallery</h2>
              <div className="mt-4">
                <Gallery images={pkg.gallery} />
              </div>
            </section>
          </RevealOnScroll>
        )}

        <EnquirySection
          trip={{
            type: 'package',
            title: pkg.title,
            slug: pkg.slug,
            startingPrice: pkg.startingPrice,
          }}
        />
      </div>
    </article>
  )
}
