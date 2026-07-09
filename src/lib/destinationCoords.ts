import type { LngLat } from './globe'

/**
 * Static coordinate lookup for the globe hero's destination waypoints (issue
 * #28). Destinations in the CMS carry no lat/lng, so we map the seeded
 * destination `name` (a country) to a single representative point — the city a
 * Safar traveller actually lands in — to plant a marker on the globe.
 *
 * This is deliberately a small hand-curated table, not a geocoder: the set of
 * destinations is short, stable and known from the seed (`src/seed/data.ts`).
 * Names are matched case-insensitively; unknown names resolve to `null` so a
 * new/edited destination simply gets no marker (never a crash — see
 * `toWaypoints`). A handful of obvious aliases are included for resilience.
 */

/** `[longitude, latitude]` in degrees for each known destination (lit city). */
const DESTINATION_COORDS: Record<string, LngLat> = {
  turkey: [28.98, 41.01], // Istanbul
  maldives: [73.51, 3.2], // Malé atolls
  italy: [12.5, 41.9], // Rome
  france: [2.35, 48.86], // Paris
  greece: [23.73, 37.98], // Athens
  egypt: [31.24, 30.04], // Cairo
  indonesia: [106.85, -6.21], // Jakarta (Bali gateway)
  spain: [-3.7, 40.42], // Madrid
  cyprus: [33.36, 35.17], // Nicosia
  'united arab emirates': [55.27, 25.2], // Dubai
  uae: [55.27, 25.2], // alias for the above
  thailand: [100.5, 13.75], // Bangkok
  'georgia and armenia': [44.79, 41.72], // Tbilisi
  georgia: [44.79, 41.72], // alias
}

/** The coordinate for a destination `name`, or `null` when we have no mapping. */
export function destinationCoord(name: string): LngLat | null {
  return DESTINATION_COORDS[name.trim().toLowerCase()] ?? null
}

/** A destination reduced to what the globe needs to plant and link a marker. */
export type DestinationWaypoint = {
  name: string
  slug: string
  coord: LngLat
}

/**
 * Turn destinations into globe waypoints, dropping any whose name we can't place
 * (they simply get no marker). Order is preserved.
 */
export function toWaypoints(
  destinations: ReadonlyArray<{ name: string; slug: string }>,
): DestinationWaypoint[] {
  return destinations.flatMap((destination) => {
    const coord = destinationCoord(destination.name)
    return coord ? [{ name: destination.name, slug: destination.slug, coord }] : []
  })
}
