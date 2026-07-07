import type { Metadata } from 'next'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl text-sea">Packages</h1>

      {packages.length === 0 ? (
        <p className="mt-6 text-lg">No Packages yet. Check back soon.</p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <li key={pkg.id}>
              <Link href={`/packages/${pkg.slug}`} className="block">
                <Card>
                  <CardHeader>
                    <CardTitle>{pkg.title}</CardTitle>
                    <p className="text-sm text-sea">{pkg.country}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-ink/70">{pkg.duration}</p>
                    <p className="mt-4 font-medium text-coral">
                      Starting ${pkg.startingPrice}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
