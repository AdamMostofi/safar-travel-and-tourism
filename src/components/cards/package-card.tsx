import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HoverLift } from '@/components/motion'
import type { PackageListItem } from '@/server/packages'

/**
 * A single Package as a floating, hover-lifting card — the shared unit of the
 * `/packages` grid and the home page's "Popular Tours". Shows the hero photo
 * (with a Sea & Sand gradient fallback when a Package has no image yet), the
 * destination country, duration, and Starting Price.
 */
export function PackageCard({ pkg }: { pkg: PackageListItem }) {
  return (
    <HoverLift className="h-full rounded-2xl">
      <Link href={`/packages/${pkg.slug}`} className="block h-full">
        <Card className="h-full overflow-hidden shadow-soft hover:shadow-lift">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-sky/50 via-cream to-sand">
            {pkg.heroImage && (
              <Image
                src={pkg.heroImage.url}
                alt={pkg.heroImage.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            )}
          </div>
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
  )
}
