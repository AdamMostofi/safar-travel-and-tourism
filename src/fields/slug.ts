import type { Field } from 'payload'

/**
 * A URL slug field plus a `beforeValidate` hook that derives the slug from a
 * source field (default: `title`) when one isn't provided. Slugs are the
 * public, human-readable URL segment for a document (PRD routing decision).
 */
export const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const slugField = (sourceField = 'title'): Field[] => [
  {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Auto-generated from the title if left blank. Used in the page URL.',
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === 'string' && value.length > 0) {
            return slugify(value)
          }
          const source = data?.[sourceField]
          if (typeof source === 'string' && source.length > 0) {
            return slugify(source)
          }
          return value
        },
      ],
    },
  },
]
