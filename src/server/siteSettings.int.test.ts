import type { Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import { resetAndSeed } from '../../test/seed-helpers'
import { getPayloadClient } from '../lib/payload'
import { getSiteSettings } from './siteSettings'

/** Integration test for the Site Settings global against a test Postgres. */
describe('site settings data layer', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getPayloadClient()
    await resetAndSeed(payload)
  })

  it('getSiteSettings returns the seeded contact details and proof metrics', async () => {
    const settings = await getSiteSettings(payload)

    expect(settings).toEqual({
      mobiles: ['+961 81 800 480', '+961 81 991 992'],
      landline: '+961 21 360 400',
      email: 'info@safartravelandtourism.com',
      address: 'Clemenceau, Beirut, Lebanon',
      whatsapp: '96181800480',
      socials: {
        instagram: 'https://www.instagram.com/safartravelandtourism/',
        facebook: 'https://www.facebook.com/share/15sY19Sd2D/',
      },
      proofMetrics: {
        yearsExperience: 20,
        destinationsCount: 150,
        flightBookings: 600,
        amazingTours: 150,
        happyClients: 700,
        cruisesBookings: 100,
      },
      footerTagline:
        'Explore the World with Us: Creating Memorable Journeys, One Destination at a Time',
    })
  })
})
