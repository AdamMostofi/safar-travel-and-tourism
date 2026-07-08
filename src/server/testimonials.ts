import type { Payload } from 'payload'

import type { Testimonial } from '../payload-types'
import { getPayloadClient } from '../lib/payload'
import { toMediaView, type MediaView } from './media'

/** A Testimonial shaped for rendering as social proof. */
export type TestimonialView = {
  id: string
  quote: string
  authorName: string
  authorLocation: string | null
  trip: string | null
  rating: number | null
  avatar: MediaView | null
  featured: boolean
}

const toView = (doc: Testimonial): TestimonialView => ({
  id: String(doc.id),
  quote: doc.quote,
  authorName: doc.authorName,
  authorLocation: doc.authorLocation ?? null,
  trip: doc.trip ?? null,
  rating: doc.rating ?? null,
  avatar: toMediaView(doc.avatar),
  featured: doc.featured ?? false,
})

/** All Testimonials, ordered by author, shaped for the UI. */
export const listTestimonials = async (
  payload?: Payload,
): Promise<TestimonialView[]> => {
  const client = payload ?? (await getPayloadClient())
  const { docs } = await client.find({
    collection: 'testimonials',
    limit: 100,
    sort: 'authorName',
    depth: 1,
  })
  return docs.map(toView)
}

/** The Featured Testimonials shown on the home page. */
export const listFeaturedTestimonials = async (
  payload?: Payload,
): Promise<TestimonialView[]> => {
  const client = payload ?? (await getPayloadClient())
  const { docs } = await client.find({
    collection: 'testimonials',
    where: { featured: { equals: true } },
    limit: 100,
    sort: 'authorName',
    depth: 1,
  })
  return docs.map(toView)
}
