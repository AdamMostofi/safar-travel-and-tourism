import type { Payload } from 'payload'

import type { Package } from '../payload-types'
import { getPayloadClient } from '../lib/payload'
import { toMediaView, toMediaViews, type MediaView } from './media'

/**
 * The server data/actions layer — the primary test seam (PRD "Testing
 * Decisions"). Pages consume only these UI-ready view models and never touch
 * Payload directly, so the shape the UI depends on is asserted here in
 * integration tests rather than in page components.
 */

/** A Destination reference as shown on a Package. */
export type DestinationRef = {
  name: string
  slug: string
}

/** A Package as shown in the `/packages` grid and home-page highlights. */
export type PackageListItem = {
  id: string
  title: string
  slug: string
  country: string
  duration: string
  startingPrice: number
  heroImage: MediaView | null
  featured: boolean
}

/** A Package as shown on its detail page. */
export type PackageDetail = PackageListItem & {
  information: string
  inclusions: string[]
  gallery: MediaView[]
  destination: DestinationRef | null
}

const toDestinationRef = (destination: Package['destination']): DestinationRef | null => {
  if (!destination || typeof destination === 'number') return null
  return { name: destination.name, slug: destination.slug }
}

const toListItem = (doc: Package): PackageListItem => ({
  id: String(doc.id),
  title: doc.title,
  slug: doc.slug,
  country: doc.country,
  duration: doc.duration,
  startingPrice: doc.startingPrice,
  heroImage: toMediaView(doc.heroImage),
  featured: doc.featured ?? false,
})

const toDetail = (doc: Package): PackageDetail => ({
  ...toListItem(doc),
  information: doc.information,
  inclusions: (doc.inclusions ?? []).map((i) => i.item),
  gallery: toMediaViews(doc.gallery),
  destination: toDestinationRef(doc.destination),
})

/**
 * All Packages, ordered by title, shaped for the list grid.
 * `payload` is injectable so tests can pass a client bound to the test DB.
 */
export const listPackages = async (payload?: Payload): Promise<PackageListItem[]> => {
  const client = payload ?? (await getPayloadClient())
  const { docs } = await client.find({
    collection: 'packages',
    limit: 100,
    sort: 'title',
    depth: 1,
  })
  return docs.map(toListItem)
}

/** The Featured Packages shown under "Popular Tours" on the home page. */
export const listFeaturedPackages = async (payload?: Payload): Promise<PackageListItem[]> => {
  const client = payload ?? (await getPayloadClient())
  const { docs } = await client.find({
    collection: 'packages',
    where: { featured: { equals: true } },
    limit: 100,
    sort: 'title',
    depth: 1,
  })
  return docs.map(toListItem)
}

/**
 * A single Package by its URL slug, or `null` when no Package has that slug
 * (the caller renders a not-found page).
 */
export const getPackageBySlug = async (
  slug: string,
  payload?: Payload,
): Promise<PackageDetail | null> => {
  const client = payload ?? (await getPayloadClient())
  const { docs } = await client.find({
    collection: 'packages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  const doc = docs[0]
  return doc ? toDetail(doc) : null
}
