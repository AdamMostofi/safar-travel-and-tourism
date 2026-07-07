import type { Payload } from 'payload'

import { packageSeeds } from './data'

/**
 * Idempotently upserts the seed Packages into the given Payload client
 * (keyed by slug), so the routine can be re-run without creating duplicates.
 * Returns the number of Packages created plus updated. Accepts an injected
 * client so tests can seed a test-DB-bound instance.
 */
export const seedPackages = async (payload: Payload): Promise<number> => {
  let count = 0
  for (const data of packageSeeds) {
    const existing = await payload.find({
      collection: 'packages',
      where: { slug: { equals: data.slug } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'packages',
        id: existing.docs[0].id,
        data,
      })
    } else {
      await payload.create({ collection: 'packages', data })
    }
    count += 1
  }
  return count
}
