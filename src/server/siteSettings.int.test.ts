import type { Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import { resetAndSeed } from '../../test/seed-helpers'
import { ASSISTANT_DEFAULTS } from '../lib/assistant'
import { whatsappLink } from '../lib/contact'
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
      assistant: {
        enabled: true,
        greeting: ASSISTANT_DEFAULTS.greeting,
        actions: [
          { type: 'route', label: 'Explore Cruises', emoji: '🚢', href: '/cruises' },
          { type: 'route', label: 'Browse Packages', emoji: '🧳', href: '/packages' },
          { type: 'route', label: 'Top Destinations', emoji: '📍', href: '/destinations' },
          {
            type: 'faq',
            label: 'Do I need a visa?',
            emoji: '🛂',
            answer:
              "Visa requirements depend on your nationality and where you're headed. Tell us your destination and passport and we'll guide you through exactly what's needed.",
          },
          {
            type: 'faq',
            label: 'When should I travel?',
            emoji: '📅',
            answer:
              'We plan trips year-round. Share your dates or the season you have in mind and we can suggest the best time and destinations for it.',
          },
          {
            type: 'faq',
            label: 'How do I pay?',
            emoji: '💳',
            answer:
              "We don't take payment online. Once we've tailored your trip, you confirm with a deposit and settle the balance directly with our team.",
          },
          {
            type: 'faq',
            label: 'How do enquiries work?',
            emoji: '📝',
            answer:
              'Browse a package, then send us an enquiry. Our team confirms availability and the details with you by phone or WhatsApp - there is no online checkout.',
          },
          {
            type: 'whatsapp',
            label: 'Message us on WhatsApp',
            emoji: '💬',
            href: whatsappLink('96181800480', "Hi Safar! I'd like to ask about a trip.")!,
          },
          {
            type: 'enquiry',
            label: 'Send an enquiry',
            emoji: '✉️',
            href: '/contact',
          },
        ],
      },
    })
  })
})
