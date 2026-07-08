import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HoverLift } from '@/components/motion'
import type { MediaView } from '@/server/media'

/**
 * The shared floating, hover-lifting trip card — the presentational shell for
 * both {@link PackageCard} and {@link CruiseCard}. Shows the hero photo (with a
 * Sea & Sand gradient fallback when there's no image yet), a subtitle (the
 * country), the duration, and the Starting Price. The typed card wrappers keep
 * their domain view-models; this holds the one shared layout.
 */
export function TripCard({
  href,
  title,
  subtitle,
  duration,
  startingPrice,
  image,
}: {
  href: string
  title: string
  subtitle: string
  duration: string
  startingPrice: number
  image: MediaView | null
}) {
  return (
    <HoverLift className="h-full rounded-2xl">
      <Link href={href} className="block h-full">
        <Card className="h-full overflow-hidden shadow-soft hover:shadow-lift">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-sky/50 via-cream to-sand">
            {image && (
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            )}
          </div>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <p className="text-sm font-medium uppercase tracking-wide text-sea">
              {subtitle}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-ink/70">{duration}</p>
            <p className="mt-4 font-display text-lg text-pine">
              Starting ${startingPrice}
            </p>
          </CardContent>
        </Card>
      </Link>
    </HoverLift>
  )
}
