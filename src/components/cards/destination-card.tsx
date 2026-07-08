import Image from 'next/image'
import Link from 'next/link'

import { HoverLift } from '@/components/motion'
import type { DestinationListItem } from '@/server/destinations'

/**
 * A Destination tile — a photo with the Destination name overlaid, lifting
 * gently on hover. Shared by the home page's "Top Destinations" and the
 * `/destinations` index; links to the Destination's own page listing its
 * Packages. Falls back to a Sea & Sand gradient when it has no image yet.
 */
export function DestinationCard({ destination }: { destination: DestinationListItem }) {
  return (
    <HoverLift className="h-full rounded-2xl">
      <Link
        href={`/destinations/${destination.slug}`}
        aria-label={`Explore ${destination.name}`}
        className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-sea/40 via-sky/40 to-sand shadow-soft hover:shadow-lift"
      >
        {destination.heroImage && (
          <Image
            src={destination.heroImage.url}
            alt={destination.heroImage.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {/* Ink scrim so the name stays legible over any photo. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <h3 className="absolute inset-x-0 bottom-0 p-4 font-display text-xl text-cream">
          {destination.name}
        </h3>
      </Link>
    </HoverLift>
  )
}
