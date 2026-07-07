import type { CollectionConfig } from 'payload'

/**
 * Media — the shared upload library (PRD story 28). Every image on the site
 * (Package/Cruise galleries and hero images, Destination hero images) is a
 * Media document with required alt text for accessibility.
 *
 * `sourceUrl` records the original `bo.safartravelandtourism.com` URL an image
 * was imported from during seeding. It is the idempotency key: the seed routine
 * reuses an existing Media doc for a URL instead of re-uploading, so re-running
 * the seed never duplicates images.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  access: {
    // Images are public; the admin panel gates uploads separately.
    read: () => true,
  },
  upload: true,
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describes the image for screen readers and when it fails to load.',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description:
          'Original import URL. Set by the seed routine and used to avoid re-importing the same image.',
      },
    },
  ],
}
