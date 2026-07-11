import type { CollectionConfig } from 'payload'

/**
 * Staff accounts for the Payload admin panel. Auth-enabled so editors can log
 * in to manage content (PRD staff/editor stories).
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Settings',
    description: 'Staff who can sign in to this admin panel.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full name',
    },
  ],
}
