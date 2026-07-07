import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/packages" className="text-sm text-sea hover:underline">
        ← All Packages
      </Link>

      <h1 className="mt-6 font-display text-4xl text-sea">{pkg.title}</h1>

      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div>
          <dt className="text-ink/60">Country</dt>
          <dd className="font-medium">{pkg.country}</dd>
        </div>
        <div>
          <dt className="text-ink/60">Duration</dt>
          <dd className="font-medium">{pkg.duration}</dd>
        </div>
        <div>
          <dt className="text-ink/60">Starting Price</dt>
          <dd className="font-medium text-coral">Starting ${pkg.startingPrice}</dd>
        </div>
      </dl>

      <p className="mt-8 whitespace-pre-line leading-relaxed">{pkg.information}</p>
    </article>
  )
}
