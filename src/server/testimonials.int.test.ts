import type { Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import { resetAndSeed } from '../../test/seed-helpers'
import { getPayloadClient } from '../lib/payload'
import { listFeaturedTestimonials, listTestimonials } from './testimonials'

/** Integration tests for the Testimonials data layer against a test Postgres. */
describe('testimonials data layer', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getPayloadClient()
    await resetAndSeed(payload)
  })

  it('listTestimonials returns all seeded testimonials sorted by author', async () => {
    const testimonials = await listTestimonials(payload)

    expect(testimonials).toHaveLength(5)
    const names = testimonials.map((t) => t.authorName)
    expect(names).toEqual([...names].sort())
    expect(names).toContain('Layla Haddad')
  })

  it('carries the view model shape', async () => {
    const testimonials = await listTestimonials(payload)
    const layla = testimonials.find((t) => t.authorName === 'Layla Haddad')

    expect(layla).toMatchObject({
      id: expect.any(String),
      authorName: 'Layla Haddad',
      authorLocation: 'Beirut',
      trip: 'Maldives',
      rating: 5,
      featured: true,
    })
    expect(layla?.quote).toContain('Maldives')
  })

  it('listFeaturedTestimonials returns only the Featured ones', async () => {
    const featured = await listFeaturedTestimonials(payload)

    expect(featured.map((t) => t.authorName).sort()).toEqual([
      'Karim Nassar',
      'Layla Haddad',
      'Nour Khalil',
      'Sami Fares',
    ])
    expect(featured.every((t) => t.featured)).toBe(true)
  })
})
