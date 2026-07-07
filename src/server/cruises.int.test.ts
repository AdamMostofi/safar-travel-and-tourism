import type { Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import { resetAndSeed } from '../../test/seed-helpers'
import { getPayloadClient } from '../lib/payload'
import { getCruiseBySlug, listCruises } from './cruises'

/** Integration tests for the Cruises data layer against a test Postgres. */
describe('cruises data layer', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getPayloadClient()
    await resetAndSeed(payload)
  })

  it('listCruises returns all seeded Cruises sorted by title', async () => {
    const cruises = await listCruises(payload)

    expect(cruises.map((c) => c.title)).toEqual([
      'MSC Divina',
      'MSC Seaside',
      'MSC Sinfonia',
    ])
    // The list view model must not leak detail-only fields.
    expect(cruises[0]).not.toHaveProperty('information')
    expect(cruises[0]).not.toHaveProperty('gallery')
  })

  it('getCruiseBySlug returns the full detail view model', async () => {
    const cruise = await getCruiseBySlug('msc-seaside', payload)

    expect(cruise).not.toBeNull()
    expect(cruise).toMatchObject({
      title: 'MSC Seaside',
      slug: 'msc-seaside',
      country: 'Italy',
      duration: '8 Days 7 Nights',
      startingPrice: 2100,
    })
    expect(cruise?.information).toContain('MSC Seaside')
    expect(cruise?.gallery).toHaveLength(2)
    expect(cruise?.heroImage).toMatchObject({ url: expect.any(String), alt: 'MSC Seaside' })
  })

  it('getCruiseBySlug returns null for an unknown slug', async () => {
    const cruise = await getCruiseBySlug('does-not-exist', payload)
    expect(cruise).toBeNull()
  })
})
