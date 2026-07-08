import type { Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import { resetAndSeed } from '../../test/seed-helpers'
import { getPayloadClient } from '../lib/payload'
import {
  getPackageBySlug,
  listFeaturedPackages,
  listPackages,
  listPackagesByDestination,
} from './packages'

/**
 * Integration tests for the Packages data layer — the PRD's primary test seam.
 * They exercise the public functions against a real (test) Postgres via
 * Payload's local API and assert external behaviour (shape, filtering, slug
 * resolution, relationships), never internal wiring.
 */
describe('packages data layer', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getPayloadClient()
    await resetAndSeed(payload)
  })

  it('listPackages returns all seeded Packages sorted by title', async () => {
    const packages = await listPackages(payload)

    expect(packages).toHaveLength(17)
    const titles = packages.map((p) => p.title)
    expect(titles).toEqual([...titles].sort())
    expect(titles).toContain('Maldives')
    expect(titles).toContain('Classic Italy Tour')
  })

  it('list items carry the card view model, including a resolved hero image', async () => {
    const packages = await listPackages(payload)
    const maldives = packages.find((p) => p.slug === 'maldives')

    expect(maldives).toMatchObject({
      id: expect.any(String),
      title: 'Maldives',
      slug: 'maldives',
      country: 'Maldives',
      duration: '5 Days 4 Nights',
      startingPrice: 1299,
      featured: true,
    })
    expect(maldives?.heroImage).toMatchObject({
      url: expect.stringContaining('/'),
      alt: 'Maldives',
    })
    // The list view model must not leak detail-only fields.
    expect(maldives).not.toHaveProperty('information')
    expect(maldives).not.toHaveProperty('gallery')
  })

  it('list items carry their Destination ref for grouping/filtering', async () => {
    const packages = await listPackages(payload)
    const maldives = packages.find((p) => p.slug === 'maldives')

    expect(maldives?.destination).toEqual({ name: 'Maldives', slug: 'maldives' })
  })

  it('listPackagesByDestination returns that Destination\'s Packages sorted by title', async () => {
    const turkey = await listPackagesByDestination('turkey', payload)

    expect(turkey.map((p) => p.slug)).toEqual([
      'adana',
      'antalya',
      'bodrum',
      'fethiye',
      'istanbul',
      'marmaris',
    ])
    expect(turkey.every((p) => p.destination?.slug === 'turkey')).toBe(true)
  })

  it('listPackagesByDestination returns [] for an unknown Destination', async () => {
    const none = await listPackagesByDestination('atlantis', payload)
    expect(none).toEqual([])
  })

  it('getPackageBySlug returns the full detail view model with relationships', async () => {
    const pkg = await getPackageBySlug('maldives', payload)

    expect(pkg).not.toBeNull()
    expect(pkg).toMatchObject({
      title: 'Maldives',
      slug: 'maldives',
      country: 'Maldives',
      duration: '5 Days 4 Nights',
      startingPrice: 1299,
      inclusions: [
        'Accommodation',
        'Tickets',
        'Insurance',
        'Transportation to/from airport',
      ],
      destination: { name: 'Maldives', slug: 'maldives' },
    })
    expect(pkg?.information).toContain('Maldives')
    expect(pkg?.gallery).toHaveLength(3)
    expect(pkg?.gallery[0]).toMatchObject({ url: expect.any(String), alt: expect.any(String) })
  })

  it('getPackageBySlug returns null for an unknown slug', async () => {
    const pkg = await getPackageBySlug('does-not-exist', payload)
    expect(pkg).toBeNull()
  })

  it('listFeaturedPackages returns only the Featured Packages', async () => {
    const featured = await listFeaturedPackages(payload)

    expect(featured.map((p) => p.slug).sort()).toEqual([
      'adana',
      'bodrum',
      'classic-italy-tour',
      'maldives',
      'marmaris',
    ])
    expect(featured.every((p) => p.featured)).toBe(true)
  })
})
