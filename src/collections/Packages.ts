import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

/**
 * Package — a bookable trip offering (the core sellable unit of the site).
 *
 * `country` is kept as a denormalised text field alongside the `destination`
 * relationship: it labels the Package independently and keeps the list/detail
 * view models cheap to build, while `destination` drives grouping and the
 * per-Destination pages. Text fields are kept locale-agnostic so an Arabic
 * locale can be layered on later without restructuring (ADR-0003).
 */
export const Packages: CollectionConfig = {
  slug: 'packages',
  labels: {
    singular: 'Package',
    plural: 'Packages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'country', 'startingPrice', 'featured', 'slug'],
  },
  access: {
    // Content is public; the admin panel gates authoring separately.
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
        description: 'The Destination country this Package sells to, e.g. Maldives.',
      },
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
      admin: {
        description: 'The Destination this Package is grouped under.',
      },
    },
    {
      name: 'duration',
      type: 'text',
      required: true,
      admin: {
        description: 'Human-readable duration, e.g. "5 Days 4 Nights".',
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
        description: 'Descriptive blurb about the Package.',
      },
    },
    {
      name: 'inclusions',
      type: 'array',
      labels: {
        singular: 'Inclusion',
        plural: 'Inclusions',
      },
      admin: {
        description: 'What the Starting Price covers (from the "Price Includes" content).',
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Lead image shown on Package cards and the detail hero.',
      },
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Photo gallery shown on the Package detail page.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in the home-page "Popular Tours" highlights.',
      },
    },
  ],
}
