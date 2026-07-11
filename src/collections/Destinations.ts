import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

/**
 * Destination — a place Safar sells Packages to (a country or city). Used to
 * group and browse Packages; a Destination has many Packages (the reverse of
 * `Package.destination`, surfaced here as the `packages` join).
 *
 * Text fields (`name`) are kept locale-agnostic so an Arabic locale can be
 * layered on later without restructuring (ADR-0003).
 */
export const Destinations: CollectionConfig = {
  slug: 'destinations',
  labels: {
    singular: 'Destination',
    plural: 'Destinations',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'featured'],
    group: 'Catalogue',
    description: 'Places we send travellers. Group Packages under a Destination and give it a photo.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Destination name',
      required: true,
      admin: {
        description: 'The Destination name, e.g. Turkey or Maldives.',
      },
    },
    ...slugField('name'),
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Lead photo',
      admin: {
        description: 'The main image shown on Destination cards and the Destination page.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in the home-page “Top Destinations” highlights.',
      },
    },
    {
      // Virtual reverse relationship — no stored column. Lets editors see and
      // navigate a Destination's Packages from its admin view.
      name: 'packages',
      type: 'join',
      collection: 'packages',
      on: 'destination',
      label: 'Packages here',
      admin: {
        description: 'Packages that sell to this Destination.',
      },
    },
  ],
}
