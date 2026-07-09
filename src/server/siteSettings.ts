import type { Payload } from 'payload'

import { type AssistantConfig, resolveAssistant } from '../lib/assistant'
import { getPayloadClient } from '../lib/payload'

/**
 * The site-wide settings (contact details, socials, proof metrics, footer copy)
 * shaped for rendering. Every page reads this instead of hard-coding values.
 */
export type SiteSettingsView = {
  mobiles: string[]
  landline: string | null
  email: string | null
  address: string | null
  whatsapp: string | null
  socials: {
    instagram: string | null
    facebook: string | null
  }
  proofMetrics: {
    yearsExperience: number | null
    destinationsCount: number | null
    flightBookings: number | null
    amazingTours: number | null
    happyClients: number | null
    cruisesBookings: number | null
  }
  footerTagline: string | null
  assistant: AssistantConfig
}

/** The single Site Settings global, shaped for the UI. */
export const getSiteSettings = async (payload?: Payload): Promise<SiteSettingsView> => {
  const client = payload ?? (await getPayloadClient())
  const settings = await client.findGlobal({ slug: 'site-settings' })
  const metrics = settings.proofMetrics ?? {}
  return {
    mobiles: (settings.mobiles ?? [])
      .map((m) => m.number)
      .filter((n): n is string => Boolean(n)),
    landline: settings.landline ?? null,
    email: settings.email ?? null,
    address: settings.address ?? null,
    whatsapp: settings.whatsapp ?? null,
    socials: {
      instagram: settings.socials?.instagram ?? null,
      facebook: settings.socials?.facebook ?? null,
    },
    proofMetrics: {
      yearsExperience: metrics.yearsExperience ?? null,
      destinationsCount: metrics.destinationsCount ?? null,
      flightBookings: metrics.flightBookings ?? null,
      amazingTours: metrics.amazingTours ?? null,
      happyClients: metrics.happyClients ?? null,
      cruisesBookings: metrics.cruisesBookings ?? null,
    },
    footerTagline: settings.footerTagline ?? null,
    assistant: resolveAssistant(settings.assistant, { whatsapp: settings.whatsapp }),
  }
}
