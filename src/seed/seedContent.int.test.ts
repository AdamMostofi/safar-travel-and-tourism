import type { Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import { fakeImageFetcher } from '../../test/fake-image'
import { resetAndSeed } from '../../test/seed-helpers'
import { getPayloadClient } from '../lib/payload'
import { seedContent } from './seedContent'

/**
 * Verifies the seed routine's key contract: running it a second time on an
 * already-seeded database updates in place rather than duplicating content
 * (upsert by slug for documents, by source URL for images).
 */
describe('seedContent idempotency', () => {
  let payload: Payload

  const counts = async () => ({
    packages: (await payload.count({ collection: 'packages' })).totalDocs,
    destinations: (await payload.count({ collection: 'destinations' })).totalDocs,
    cruises: (await payload.count({ collection: 'cruises' })).totalDocs,
    media: (await payload.count({ collection: 'media' })).totalDocs,
  })

  beforeAll(async () => {
    payload = await getPayloadClient()
    await resetAndSeed(payload)
  })

  it('a second seed run does not create duplicates', async () => {
    const before = await counts()
    expect(before).toEqual({ packages: 17, destinations: 12, cruises: 3, media: before.media })

    await seedContent(payload, { fetchImage: fakeImageFetcher })

    expect(await counts()).toEqual(before)
  })
})
