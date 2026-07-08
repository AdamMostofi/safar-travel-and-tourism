import type { LucideIcon } from 'lucide-react'
import { Compass, Headphones, Plane, Ship } from 'lucide-react'

/** One of Safar's services, with its icon and brand-voice blurb. */
export type Service = { icon: LucideIcon; title: string; body: string }

/**
 * What Safar does — the fixed services overview, shared by the home page's
 * "How we help" section and the About page so the copy lives in one place.
 * Iconography is drawn from the service itself.
 */
export const SERVICES: Service[] = [
  {
    icon: Compass,
    title: 'Curated Packages',
    body: 'Handpicked trips across 150+ destinations, each with a clear Starting Price and what it includes.',
  },
  {
    icon: Ship,
    title: 'Cruises',
    body: 'Mediterranean cruises on MSC ships, sold and browsed as their own category.',
  },
  {
    icon: Plane,
    title: 'Flights & Visas',
    body: 'We book the flights and sort the paperwork, so you can just pack and go.',
  },
  {
    icon: Headphones,
    title: 'Human service',
    body: 'Talk to a real advisor by phone or WhatsApp — no checkout, no bots, no pressure.',
  },
]
