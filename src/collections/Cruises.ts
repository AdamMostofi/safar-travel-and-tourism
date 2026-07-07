import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

/**
 * Cruise — a Package whose transport and lodging is a cruise ship. Sold and
 * browsed as its own top-level category, separate from land Packages
 * (CONTEXT.md), so it is a sibling collection rather than a flag on Package.
 *
 * Text fields are kept locale-agnostic so an Arabic locale can be layered on
 * later without restructuring (ADR-0003).
 */
export const Cruises: CollectionConfig = {
  slug: 'cruises',
  labels: {
    singular: 'Cruise',
    plural: 'Cruises',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'country', 'startingPrice', 'slug'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
    {
      name: 'country',
      type: 'text',
      required: true,
      admin: {
        description: 'The country/region this Cruise sails, e.g. Italy.',
      },
    },
    {
      name: 'duration',
      type: 'text',
      required: true,
      admin: {
        description: 'Human-readable duration, e.g. "8 Days 7 Nights".',
      },
    },
    {
      name: 'startingPrice',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Indicative "from" price in USD. Shown as "Starting $X" — never a checkout total.',
      },
    },
    {
      name: 'information',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Descriptive blurb about the Cruise itinerary.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Lead image shown on Cruise cards and the Cruise detail hero.',
      },
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Photo gallery shown on the Cruise detail page.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in home-page highlights.',
      },
    },
  ],
}
