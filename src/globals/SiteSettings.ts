import type { GlobalConfig } from 'payload'

/**
 * SiteSettings — one editable record of the contact details, socials, proof
 * metrics, and footer copy that appear across the whole site (PRD story 29).
 * Kept as a Payload global so staff edit these in one place and every page
 * reads the same source instead of hard-coding them.
 *
 * Text is locale-agnostic so an Arabic locale can be layered on later
 * without restructuring (ADR-0003).
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'mobiles',
      type: 'array',
      label: 'Mobile numbers',
      admin: {
        description: 'Mobile "Call us" numbers, shown in the header/footer.',
      },
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'landline',
      type: 'text',
      admin: {
        description: 'Land-line phone number.',
      },
    },
    {
      name: 'email',
      type: 'text',
      admin: {
        description: 'Public "Write to us" email address.',
      },
    },
    {
      name: 'address',
      type: 'text',
      admin: {
        description: 'Physical address.',
      },
    },
    {
      name: 'whatsapp',
      type: 'text',
      label: 'WhatsApp number',
      admin: {
        description: 'WhatsApp number in international format, digits only (e.g. 96181800480). Used to build wa.me deep links.',
      },
    },
    {
      name: 'socials',
      type: 'group',
      admin: {
        description: 'Social profile links.',
      },
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
      ],
    },
    {
      name: 'proofMetrics',
      type: 'group',
      label: 'Proof metrics',
      admin: {
        description: 'The trust figures shown on the home page (animated counters).',
      },
      fields: [
        { name: 'yearsExperience', type: 'number', label: 'Years of experience' },
        { name: 'destinationsCount', type: 'number', label: 'Destinations' },
        { name: 'flightBookings', type: 'number', label: 'Flight bookings' },
        { name: 'amazingTours', type: 'number', label: 'Amazing tours' },
        { name: 'happyClients', type: 'number', label: 'Happy clients' },
        { name: 'cruisesBookings', type: 'number', label: 'Cruises bookings' },
      ],
    },
    {
      name: 'footerTagline',
      type: 'text',
      admin: {
        description: 'Short brand line shown in the footer.',
      },
    },
    {
      name: 'assistant',
      type: 'group',
      label: 'Marlo assistant',
      admin: {
        description: 'The floating Marlo travel assistant shown in the corner of the site.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Show the assistant',
          defaultValue: true,
          admin: {
            description: 'Uncheck to hide Marlo everywhere on the site.',
          },
        },
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          admin: {
            description: 'Assistant name shown in the panel header. Defaults to “Marlo” when blank.',
          },
        },
        {
          name: 'greeting',
          type: 'textarea',
          label: 'Greeting',
          admin: {
            description: 'Opening message shown when the panel is opened. Falls back to a default when blank.',
          },
        },
      ],
    },
  ],
}
