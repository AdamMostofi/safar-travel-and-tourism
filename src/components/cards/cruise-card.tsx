import { TripCard } from '@/components/cards/trip-card'
import type { CruiseListItem } from '@/server/cruises'

/**
 * A single Cruise as a floating, hover-lifting card — the unit of the
 * `/cruises` grid. Cruises are their own top-level category (CONTEXT.md); this
 * adapts the Cruise view-model onto the shared {@link TripCard} shell.
 */
export function CruiseCard({ cruise }: { cruise: CruiseListItem }) {
  return (
    <TripCard
      href={`/cruises/${cruise.slug}`}
      title={cruise.title}
      subtitle={cruise.country}
      duration={cruise.duration}
      startingPrice={cruise.startingPrice}
      image={cruise.heroImage}
    />
  )
}
