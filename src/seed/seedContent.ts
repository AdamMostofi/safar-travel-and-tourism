import type { Payload } from 'payload'

import {
  cruiseSeeds,
  destinationSeeds,
  packageSeeds,
  siteSettingsSeed,
  testimonialSeeds,
} from './data'

/**
 * Seeds all launch content (Destinations, Packages, Cruises, Media, and the
 * Site Settings global) from `data.ts` into a Payload client.
 *
 * Idempotent: content documents are upserted by `slug` and images by their
 * source URL, so re-running never creates duplicates. Accepts an injected
 * Payload client (so tests can seed a test-DB-bound instance) and an injected
 * image fetcher (so tests avoid real network calls).
 */

export type SeedImage = { data: Buffer; mimetype: string; name: string }

/** Fetches the bytes for an image URL. Injectable so tests can stub it. */
export type ImageFetcher = (url: string) => Promise<SeedImage>

export type SeedResult = {
  destinations: number
  packages: number
  cruises: number
  media: number
}

const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

const filenameFromUrl = (url: string): string => {
  const { pathname } = new URL(url)
  return decodeURIComponent(pathname.slice(pathname.lastIndexOf('/') + 1))
}

/**
 * Default fetcher used by the seed CLI: downloads the image over the network.
 * Mimetype is taken from the file extension (falling back to the response
 * header) so Payload's upload validation always agrees with the filename.
 */
export const fetchImageFromNetwork: ImageFetcher = async (url) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = Buffer.from(await res.arrayBuffer())
  const name = filenameFromUrl(url)
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  const headerMime = res.headers.get('content-type')?.split(';')[0]?.trim()
  const mimetype = EXT_TO_MIME[ext] ?? headerMime ?? 'application/octet-stream'
  return { data, mimetype, name }
}

/**
 * Imports one image into Media, keyed by its source URL. Returns the Media id,
 * or `null` when the image could not be fetched (the seed continues without it
 * rather than failing the whole run). `cache` dedupes within a single run.
 */
const importMedia = async (
  payload: Payload,
  url: string,
  alt: string,
  fetchImage: ImageFetcher,
  cache: Map<string, number | null>,
): Promise<number | null> => {
  const cached = cache.get(url)
  if (cached !== undefined) return cached

  const existing = await payload.find({
    collection: 'media',
    where: { sourceUrl: { equals: url } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs[0]) {
    const id = existing.docs[0].id as number
    cache.set(url, id)
    return id
  }

  let image: SeedImage
  try {
    image = await fetchImage(url)
  } catch (err) {
    payload.logger.warn(`Skipping image ${url}: ${(err as Error).message}`)
    cache.set(url, null)
    return null
  }

  const doc = await payload.create({
    collection: 'media',
    data: { alt, sourceUrl: url },
    file: {
      data: image.data,
      mimetype: image.mimetype,
      name: image.name,
      size: image.data.length,
    },
  })
  const id = doc.id as number
  cache.set(url, id)
  return id
}

type SeedableSlug = 'destinations' | 'packages' | 'cruises'

/**
 * Imports a gallery of images for a titled item, returning the ids of those
 * that resolved (dropping any that failed to fetch). Shared by the Package and
 * Cruise seed loops, which both carry a `title` + `gallery` of URLs.
 */
const importGallery = async (
  payload: Payload,
  title: string,
  urls: string[],
  fetchImage: ImageFetcher,
  cache: Map<string, number | null>,
): Promise<number[]> => {
  const ids: number[] = []
  for (const [i, url] of urls.entries()) {
    const mediaId = await importMedia(payload, url, `${title} - photo ${i + 1}`, fetchImage, cache)
    if (mediaId !== null) ids.push(mediaId)
  }
  return ids
}

/** Returns the id of the document with this slug, or `undefined` if none. */
const findIdBySlug = async (
  payload: Payload,
  collection: SeedableSlug,
  slug: string,
): Promise<number | undefined> => {
  const { docs } = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return docs[0]?.id as number | undefined
}

export const seedContent = async (
  payload: Payload,
  options: { fetchImage?: ImageFetcher } = {},
): Promise<SeedResult> => {
  const fetchImage = options.fetchImage ?? fetchImageFromNetwork
  const mediaCache = new Map<string, number | null>()

  // Destinations first — Packages reference them by slug.
  const destinationIdBySlug = new Map<string, number>()
  for (const d of destinationSeeds) {
    const heroImage = await importMedia(payload, d.heroImage, d.name, fetchImage, mediaCache)
    const data = { name: d.name, slug: d.slug, heroImage, featured: d.featured }
    const existingId = await findIdBySlug(payload, 'destinations', d.slug)
    const doc = existingId
      ? await payload.update({ collection: 'destinations', id: existingId, data })
      : await payload.create({ collection: 'destinations', data })
    destinationIdBySlug.set(d.slug, doc.id as number)
  }

  for (const p of packageSeeds) {
    const heroImage = await importMedia(payload, p.heroImage, p.title, fetchImage, mediaCache)
    const gallery = await importGallery(payload, p.title, p.gallery, fetchImage, mediaCache)
    const data = {
      title: p.title,
      slug: p.slug,
      country: p.country,
      destination: destinationIdBySlug.get(p.destinationSlug) ?? null,
      duration: p.duration,
      startingPrice: p.startingPrice,
      information: p.information,
      inclusions: p.inclusions.map((item) => ({ item })),
      heroImage,
      gallery,
      featured: p.featured,
    }
    const existingId = await findIdBySlug(payload, 'packages', p.slug)
    if (existingId) {
      await payload.update({ collection: 'packages', id: existingId, data })
    } else {
      await payload.create({ collection: 'packages', data })
    }
  }

  for (const c of cruiseSeeds) {
    const heroImage = await importMedia(payload, c.heroImage, c.title, fetchImage, mediaCache)
    const gallery = await importGallery(payload, c.title, c.gallery, fetchImage, mediaCache)
    const data = {
      title: c.title,
      slug: c.slug,
      country: c.country,
      duration: c.duration,
      startingPrice: c.startingPrice,
      information: c.information,
      heroImage,
      gallery,
      featured: c.featured,
    }
    const existingId = await findIdBySlug(payload, 'cruises', c.slug)
    if (existingId) {
      await payload.update({ collection: 'cruises', id: existingId, data })
    } else {
      await payload.create({ collection: 'cruises', data })
    }
  }

  // Testimonials carry no slug, so they upsert by author name.
  for (const t of testimonialSeeds) {
    const data = {
      quote: t.quote,
      authorName: t.authorName,
      authorLocation: t.authorLocation,
      trip: t.trip,
      rating: t.rating,
      featured: t.featured,
    }
    const existing = await payload.find({
      collection: 'testimonials',
      where: { authorName: { equals: t.authorName } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs[0]) {
      await payload.update({ collection: 'testimonials', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'testimonials', data })
    }
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      mobiles: siteSettingsSeed.mobiles.map((number) => ({ number })),
      landline: siteSettingsSeed.landline,
      email: siteSettingsSeed.email,
      address: siteSettingsSeed.address,
      whatsapp: siteSettingsSeed.whatsapp,
      socials: siteSettingsSeed.socials,
      proofMetrics: siteSettingsSeed.proofMetrics,
      footerTagline: siteSettingsSeed.footerTagline,
      assistant: { actions: siteSettingsSeed.assistant.actions },
    },
  })

  const media = [...mediaCache.values()].filter((id) => id !== null).length
  return {
    destinations: destinationSeeds.length,
    packages: packageSeeds.length,
    cruises: cruiseSeeds.length,
    media,
  }
}
