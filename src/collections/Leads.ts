import type { CollectionConfig } from 'payload'

/**
 * Lead — a captured Enquiry stored for staff follow-up (CONTEXT.md). Created by
 * the public `submitEnquiry` server action; never a paid booking (ADR-0002).
 *
 * Leads are private: the enquirer's details are readable only in the admin
 * panel, so every access rule requires an authenticated staff user. The server
 * action writes via Payload's local API, which overrides access, so the public
 * form can create Leads without opening `create` to the world.
 *
 * The trip being enquired about is denormalised onto the Lead (`tripType`,
 * `tripTitle`, `tripSlug`, `tripStartingPrice`) so staff see the context at a
 * glance and it survives even if that Package/Cruise is later edited.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: {
    singular: 'Lead',
    plural: 'Leads',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'contact', 'tripTitle', 'createdAt'],
    group: 'Enquiries',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'contact',
      type: 'text',
      required: true,
      admin: {
        description: 'How to reach them — phone, email, or WhatsApp.',
      },
    },
    {
      name: 'preferredDates',
      type: 'text',
      admin: {
        description: 'When they hope to travel (free text).',
      },
    },
    {
      name: 'partySize',
      type: 'number',
      min: 1,
      admin: {
        description: 'How many people are travelling.',
      },
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'tripType',
      type: 'select',
      options: [
        { label: 'Package', value: 'package' },
        { label: 'Cruise', value: 'cruise' },
      ],
      admin: {
        description: 'The kind of trip enquired about.',
        position: 'sidebar',
      },
    },
    {
      name: 'tripTitle',
      type: 'text',
      admin: {
        description: 'The Package/Cruise title at the time of enquiry.',
        position: 'sidebar',
      },
    },
    {
      name: 'tripSlug',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'tripStartingPrice',
      type: 'number',
      admin: {
        description: 'The Starting Price shown when they enquired.',
        position: 'sidebar',
      },
    },
  ],
}
