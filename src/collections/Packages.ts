import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

/**
 * Package — a bookable trip offering (the core sellable unit of the site).
 *
 * This is the tracer-slice shape: the minimum fields needed to render a detail
 * page. Later slices add destination (relationship), inclusions, gallery, hero
 * image, and the `featured` flag. Text fields are kept locale-agnostic so an
 * Arabic locale can be layered on later without restructuring (ADR-0003).
 */
export const Packages: CollectionConfig = {
  slug: 'packages',
  labels: {
    singular: 'Package',
    plural: 'Packages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'country', 'startingPrice', 'slug'],
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
  ],
}
