import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

/**
 * Cruise — a Package whose transport and lodging is a cruise ship. Sold and
 * browsed as its own top-level category, separate from land Packages
 * (CONTEXT.md), so it is a sibling collection rather than a flag on Package.
 *
 * Text fields are kept locale-agnostic so an Arabic locale can be layered on
 * later without restructuring (ADR-0003). The editing form uses presentational
 * (unnamed) tabs, so the layout is friendlier without changing the stored shape.
 */
export const Cruises: CollectionConfig = {
  slug: 'cruises',
  labels: {
    singular: 'Cruise',
    plural: 'Cruises',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'country', 'startingPrice', 'featured'],
    group: 'Catalogue',
    description: 'Cruise holidays, browsed on their own page separately from land Packages.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Cruise name',
      required: true,
      admin: {
        description: 'The name travellers see, e.g. “Greek Isles Cruise”.',
      },
    },
    ...slugField(),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          description: 'The essentials shown on cards and at the top of the page.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'country',
                  type: 'text',
                  label: 'Country / region',
                  required: true,
                  admin: {
                    description: 'The country or region this Cruise sails, e.g. Italy.',
                  },
                },
                {
                  name: 'duration',
                  type: 'text',
                  label: 'Duration',
                  required: true,
                  admin: {
                    description: 'How long the cruise is, e.g. “8 Days 7 Nights”.',
                  },
                },
              ],
            },
            {
              name: 'startingPrice',
              type: 'number',
              label: 'Starting price (USD)',
              required: true,
              min: 0,
              admin: {
                description: 'The “from” price. Shown as “Starting $X” - never a checkout total.',
              },
            },
          ],
        },
        {
          label: 'About',
          description: 'The description of the cruise itinerary.',
          fields: [
            {
              name: 'information',
              type: 'textarea',
              label: 'Description',
              required: true,
              admin: {
                description: 'A short, inviting blurb about the Cruise itinerary.',
              },
            },
          ],
        },
        {
          label: 'Photos',
          description: 'The lead image and the gallery shown on the Cruise page.',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Lead photo',
              admin: {
                description: 'The main image shown on Cruise cards and the detail hero.',
              },
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Photo gallery',
              admin: {
                description: 'Extra photos shown on the Cruise detail page.',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in the home-page highlights.',
      },
    },
  ],
}
