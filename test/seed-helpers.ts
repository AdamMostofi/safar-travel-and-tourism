import type { Payload } from 'payload'

import { seedContent, type SeedResult } from '../src/seed/seedContent'
import { fakeImageFetcher } from './fake-image'

/**
 * Migrates, clears, and re-seeds the test database into a known-clean state
 * using the fake (offline) image fetcher. Shared by the data-layer integration
 * suites so each starts from the same fixed content.
 *
 * Collections are cleared children-first (Packages/Cruises reference Media and
 * Destinations; Destinations reference Media) so deletes never violate FKs.
 */
const CLEAR_ORDER = [
  'leads',
  'testimonials',
  'packages',
  'cruises',
  'destinations',
  'media',
] as const

export const resetAndSeed = async (payload: Payload): Promise<SeedResult> => {
  await payload.db.migrate()
  for (const collection of CLEAR_ORDER) {
    const existing = await payload.find({ collection, limit: 1000, depth: 0 })
    for (const doc of existing.docs) {
      await payload.delete({ collection, id: doc.id })
    }
  }
  return seedContent(payload, { fetchImage: fakeImageFetcher })
}
