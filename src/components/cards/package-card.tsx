import { TripCard } from '@/components/cards/trip-card'
import type { PackageListItem } from '@/server/packages'

/**
 * A single Package as a floating, hover-lifting card — the shared unit of the
 * `/packages` grid and the home page's "Popular Tours". Adapts the Package
 * view-model onto the shared {@link TripCard} shell, showing the destination
 * country, duration, and Starting Price.
 */
export function PackageCard({ pkg }: { pkg: PackageListItem }) {
  return (
    <TripCard
      href={`/packages/${pkg.slug}`}
      title={pkg.title}
      subtitle={pkg.country}
      duration={pkg.duration}
      startingPrice={pkg.startingPrice}
      image={pkg.heroImage}
    />
  )
}
