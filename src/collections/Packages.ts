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
 *
 * The editing form is organised into presentational tabs (Details / The trip /
 * Photos) for non-technical staff; the tabs are unnamed, so they change only
 * the layout, not the stored shape. `slug` and `featured` stay in the sidebar.
 */
export const Packages: CollectionConfig = {
  slug: 'packages',
  labels: {
    singular: 'Package',
    plural: 'Packages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'country', 'startingPrice', 'featured'],
    group: 'Catalogue',
    description: 'The trips we sell. Each Package has a starting price, what’s included, and photos.',
  },
  access: {
    // Content is public; the admin panel gates authoring separately.
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Package name',
      required: true,
      admin: {
        description: 'The name travellers see, e.g. “Maldives Escape”.',
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
                  label: 'Country',
                  required: true,
                  admin: {
                    description: 'The country this Package sells to, e.g. Maldives.',
                  },
                },
                {
                  name: 'duration',
                  type: 'text',
                  label: 'Duration',
                  required: true,
                  admin: {
                    description: 'How long the trip is, e.g. “5 Days 4 Nights”.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
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
                {
                  name: 'destination',
                  type: 'relationship',
                  relationTo: 'destinations',
                  label: 'Destination',
                  admin: {
                    description: 'The Destination this Package is grouped under.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'The trip',
          description: 'The description and what the starting price includes.',
          fields: [
            {
              name: 'information',
              type: 'textarea',
              label: 'Description',
              required: true,
              admin: {
                description: 'A short, inviting blurb about the Package.',
              },
            },
            {
              name: 'inclusions',
              type: 'array',
              label: 'What’s included',
              labels: {
                singular: 'Inclusion',
                plural: 'Inclusions',
              },
              admin: {
                description: 'What the Starting Price covers - add one line per item.',
              },
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  label: 'Item',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Photos',
          description: 'The lead image and the gallery shown on the Package page.',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Lead photo',
              admin: {
                description: 'The main image shown on Package cards and the detail hero.',
              },
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Photo gallery',
              admin: {
                description: 'Extra photos shown on the Package detail page.',
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
        description: 'Show in the home-page “Popular Tours” highlights.',
      },
    },
  ],
}
