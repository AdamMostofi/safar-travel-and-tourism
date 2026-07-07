import type { Metadata } from 'next'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HoverLift, RevealOnScroll } from '@/components/motion'
import { listPackages } from '@/server/packages'

export const metadata: Metadata = {
  title: 'Packages',
  description: 'Browse curated travel Packages from Safar Travel & Tourism.',
}

// Content is CMS-driven; render fresh so newly-published Packages appear.
export const dynamic = 'force-dynamic'

export default async function PackagesPage() {
  const packages = await listPackages()

  return (
    <div className="mx-auto max-w-content px-6 py-section">
      <RevealOnScroll>
        <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">
          Curated journeys
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Packages</h1>
      </RevealOnScroll>

      {packages.length === 0 ? (
        <p className="mt-6 text-lg text-ink/70">No Packages yet. Check back soon.</p>
      ) : (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <li key={pkg.id}>
              <RevealOnScroll delay={i * 0.06}>
                <HoverLift className="h-full rounded-2xl">
                  <Link href={`/packages/${pkg.slug}`} className="block h-full">
                    <Card className="h-full shadow-soft hover:shadow-lift">
                      <CardHeader>
                        <CardTitle>{pkg.title}</CardTitle>
                        <p className="text-sm font-medium uppercase tracking-wide text-sea">
                          {pkg.country}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-ink/70">{pkg.duration}</p>
                        <p className="mt-4 font-display text-lg text-coral">
                          Starting ${pkg.startingPrice}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </HoverLift>
              </RevealOnScroll>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
