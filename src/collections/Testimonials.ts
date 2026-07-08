import type { CollectionConfig } from 'payload'

/**
 * Testimonial — a traveller's short quote shown as social proof (issue #12).
 * Attributed (name, optional location and trip), optionally rated and with a
 * photo, and optionally Featured for the home page.
 *
 * Public content (like Packages/Cruises/Destinations): readable by anyone, with
 * authoring gated by the admin panel. Text fields are locale-agnostic so an
 * Arabic locale can be layered on later (ADR-0003).
 */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonial',
    plural: 'Testimonials',
  },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'trip', 'rating', 'featured'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: { description: 'The traveller\'s words, in their voice.' },
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'authorLocation',
      type: 'text',
      admin: { description: 'Where they\'re from, e.g. Beirut.' },
    },
    {
      name: 'trip',
      type: 'text',
      admin: { description: 'The trip they took, e.g. Maldives.' },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      admin: { description: 'Star rating out of 5.' },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional photo of the traveller.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in the home-page testimonials.',
      },
    },
  ],
}
