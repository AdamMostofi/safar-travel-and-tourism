import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { HeroGradient } from '@/components/hero-gradient'
import { KenBurns, RevealOnScroll } from '@/components/motion'
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

  return (
    <article>
      {/* Ken-Burns banner over a Sea & Sand gradient (image-only hero). */}
      <div className="relative">
        <KenBurns className="h-[42vh] min-h-[280px] w-full">
          <HeroGradient className="bg-gradient-to-br from-sea/25 via-sky/40 to-sand" />
        </KenBurns>
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-3xl px-6 pb-8">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-sea">
                {pkg.country}
              </p>
              <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
                {pkg.title}
              </h1>
            </RevealOnScroll>
          </div>
        </div>
      </div>

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
      </div>
    </article>
  )
}
