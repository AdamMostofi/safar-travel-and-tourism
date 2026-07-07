import type { Payload } from 'payload'

import type { Destination } from '../payload-types'
import { getPayloadClient } from '../lib/payload'
import { toMediaView, type MediaView } from './media'

/** A Destination as shown in the grid and home-page "Top Destinations". */
export type DestinationListItem = {
  id: string
  name: string
  slug: string
  heroImage: MediaView | null
  featured: boolean
}

const toListItem = (doc: Destination): DestinationListItem => ({
  id: String(doc.id),
  name: doc.name,
  slug: doc.slug,
  heroImage: toMediaView(doc.heroImage),
  featured: doc.featured ?? false,
})

/** All Destinations, ordered by name, shaped for the grid. */
export const listDestinations = async (
  payload?: Payload,
): Promise<DestinationListItem[]> => {
  const client = payload ?? (await getPayloadClient())
  const { docs } = await client.find({
    collection: 'destinations',
    limit: 100,
    sort: 'name',
    depth: 1,
  })
  return docs.map(toListItem)
}

/** The Featured Destinations shown under "Top Destinations" on the home page. */
export const listFeaturedDestinations = async (
  payload?: Payload,
): Promise<DestinationListItem[]> => {
  const client = payload ?? (await getPayloadClient())
  const { docs } = await client.find({
    collection: 'destinations',
    where: { featured: { equals: true } },
    limit: 100,
    sort: 'name',
    depth: 1,
  })
  return docs.map(toListItem)
}

/**
 * A single Destination by slug, or `null` when none matches (the caller renders
 * a not-found page). The Destination's Packages are read via `listPackages`
 * filtered by destination on the page, or a future dedicated function.
 */
export const getDestinationBySlug = async (
  slug: string,
  payload?: Payload,
): Promise<DestinationListItem | null> => {
  const client = payload ?? (await getPayloadClient())
  const { docs } = await client.find({
    collection: 'destinations',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  const doc = docs[0]
  return doc ? toListItem(doc) : null
}
