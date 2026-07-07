import type { Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import { getPayloadClient } from '../lib/payload'
import { seedPackages } from '../seed/seedPackages'
import { getPackageBySlug, listPackages } from './packages'

/**
 * Integration tests for the server data layer — the PRD's primary test seam.
 * They exercise the public functions against a real (test) Postgres via
 * Payload's local API and assert the external behaviour (shape, filtering,
 * slug resolution), never internal wiring.
 */
describe('packages data layer', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getPayloadClient()
    // Apply migrations to the fresh test DB, then start from a known-clean
    // state and seed the fixed content.
    await payload.db.migrate()
    // Start from a known-clean state, then seed the fixed content.
    const existing = await payload.find({ collection: 'packages', limit: 1000, depth: 0 })
    for (const doc of existing.docs) {
      await payload.delete({ collection: 'packages', id: doc.id })
    }
    await seedPackages(payload)
  })

  it('listPackages returns shaped view models sorted by title', async () => {
    const packages = await listPackages(payload)

    expect(packages).toHaveLength(2)
    expect(packages.map((p) => p.title)).toEqual([
      'Classic Italy Tour',
      'Get the Best out of Maldives',
    ])

    const italy = packages[0]
    expect(italy).toEqual({
      id: expect.any(String),
      title: 'Classic Italy Tour',
      slug: 'classic-italy-tour',
      country: 'Italy',
      duration: '7 Days 6 Nights',
      startingPrice: 1049,
    })
    // The list view model must not leak the detail-only `information` field.
    expect(italy).not.toHaveProperty('information')
  })

  it('getPackageBySlug returns the full detail view model', async () => {
    const pkg = await getPackageBySlug('maldives', payload)

    expect(pkg).not.toBeNull()
    expect(pkg).toMatchObject({
      title: 'Get the Best out of Maldives',
      slug: 'maldives',
      country: 'Maldives',
      duration: '5 Days 4 Nights',
      startingPrice: 1299,
    })
    expect(pkg?.information).toContain('Maldives')
  })

  it('getPackageBySlug returns null for an unknown slug', async () => {
    const pkg = await getPackageBySlug('does-not-exist', payload)
    expect(pkg).toBeNull()
  })
})
