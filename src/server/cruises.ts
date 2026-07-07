import type { Payload } from 'payload'

import type { Cruise } from '../payload-types'
import { getPayloadClient } from '../lib/payload'
import { toMediaView, toMediaViews, type MediaView } from './media'

/** A Cruise as shown in the `/cruises` grid. */
export type CruiseListItem = {
  id: string
  title: string
  slug: string
  country: string
  duration: string
  startingPrice: number
  heroImage: MediaView | null
  featured: boolean
}

/** A Cruise as shown on its detail page. */
export type CruiseDetail = CruiseListItem & {
  information: string
  gallery: MediaView[]
}

const toListItem = (doc: Cruise): CruiseListItem => ({
  id: String(doc.id),
  title: doc.title,
  slug: doc.slug,
  country: doc.country,
  duration: doc.duration,
  startingPrice: doc.startingPrice,
  heroImage: toMediaView(doc.heroImage),
  featured: doc.featured ?? false,
})

const toDetail = (doc: Cruise): CruiseDetail => ({
  ...toListItem(doc),
  information: doc.information,
  gallery: toMediaViews(doc.gallery),
})

/** All Cruises, ordered by title, shaped for the list grid. */
export const listCruises = async (payload?: Payload): Promise<CruiseListItem[]> => {
  const client = payload ?? (await getPayloadClient())
  const { docs } = await client.find({
    collection: 'cruises',
    limit: 100,
    sort: 'title',
    depth: 1,
  })
  return docs.map(toListItem)
}

/**
 * A single Cruise by its URL slug, or `null` when no Cruise has that slug (the
 * caller renders a not-found page).
 */
export const getCruiseBySlug = async (
  slug: string,
  payload?: Payload,
): Promise<CruiseDetail | null> => {
  const client = payload ?? (await getPayloadClient())
  const { docs } = await client.find({
    collection: 'cruises',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  const doc = docs[0]
  return doc ? toDetail(doc) : null
}
