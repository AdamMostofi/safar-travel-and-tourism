import type { Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import { resetAndSeed } from '../../test/seed-helpers'
import { getPayloadClient } from '../lib/payload'
import {
  getDestinationBySlug,
  listDestinations,
  listFeaturedDestinations,
} from './destinations'

/** Integration tests for the Destinations data layer against a test Postgres. */
describe('destinations data layer', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getPayloadClient()
    await resetAndSeed(payload)
  })

  it('listDestinations returns all seeded Destinations sorted by name', async () => {
    const destinations = await listDestinations(payload)

    expect(destinations).toHaveLength(12)
    const names = destinations.map((d) => d.name)
    expect(names).toEqual([...names].sort())
    const turkey = destinations.find((d) => d.slug === 'turkey')
    expect(turkey).toMatchObject({
      name: 'Turkey',
      slug: 'turkey',
      featured: true,
    })
    expect(turkey?.heroImage).toMatchObject({ url: expect.any(String), alt: 'Turkey' })
  })

  it('listFeaturedDestinations returns only the six Top Destinations', async () => {
    const featured = await listFeaturedDestinations(payload)

    expect(featured.map((d) => d.slug).sort()).toEqual([
      'egypt',
      'france',
      'greece',
      'italy',
      'maldives',
      'turkey',
    ])
    expect(featured.every((d) => d.featured)).toBe(true)
  })

  it('getDestinationBySlug resolves a Destination, or null for an unknown slug', async () => {
    const italy = await getDestinationBySlug('italy', payload)
    expect(italy).toMatchObject({ name: 'Italy', slug: 'italy' })

    const missing = await getDestinationBySlug('atlantis', payload)
    expect(missing).toBeNull()
  })
})
