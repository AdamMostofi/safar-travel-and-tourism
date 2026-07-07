import type { Payload } from 'payload'

import type { Package } from '../payload-types'
import { getPayloadClient } from '../lib/payload'

/**
 * The server data/actions layer — the primary test seam (PRD "Testing
 * Decisions"). Pages consume only these UI-ready view models and never touch
 * Payload directly, so the shape the UI depends on is asserted here in
 * integration tests rather than in page components.
 */

/** A Package as shown in the `/packages` grid. */
export type PackageListItem = {
  id: string
  title: string
  slug: string
  country: string
  duration: string
  startingPrice: number
}

/** A Package as shown on its detail page. */
export type PackageDetail = PackageListItem & {
  information: string
}

const toListItem = (doc: Package): PackageListItem => ({
  id: String(doc.id),
  title: doc.title,
  slug: doc.slug,
  country: doc.country,
  duration: doc.duration,
  startingPrice: doc.startingPrice,
})

const toDetail = (doc: Package): PackageDetail => ({
  ...toListItem(doc),
  information: doc.information,
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
    depth: 0,
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
    depth: 0,
  })
  const doc = docs[0]
  return doc ? toDetail(doc) : null
}
