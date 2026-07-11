import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Cruises } from './collections/Cruises'
import { Destinations } from './collections/Destinations'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Packages } from './collections/Packages'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// On Vercel (and any serverless host) the filesystem is ephemeral, so uploaded
// media must go to object storage instead of local disk. When a Vercel Blob
// token is present we route the Media collection there; otherwise (local dev,
// tests) uploads fall back to Payload's default local-disk storage.
const blobToken = process.env.BLOB_READ_WRITE_TOKEN
const storagePlugins = blobToken
  ? [
      vercelBlobStorage({
        collections: { media: true },
        token: blobToken,
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Safar Admin',
      defaultOGImageType: 'off',
      icons: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    },
    // Side-by-side preview of the live page while editing. The admin and the
    // site share an origin, so a relative URL works in every environment. The
    // collection slug matches its front-end route segment (packages/cruises/
    // destinations). New docs (no slug yet) fall back to the home page.
    livePreview: {
      url: ({ data, collectionConfig }) =>
        data?.slug ? `/${collectionConfig?.slug}/${data.slug}` : '/',
      collections: ['packages', 'cruises', 'destinations'],
    },
    components: {
      graphics: {
        Icon: '@/components/admin/Icon#Icon',
        Logo: '@/components/admin/Logo#Logo',
      },
      beforeDashboard: ['@/components/admin/BeforeDashboard#BeforeDashboard'],
      beforeLogin: ['@/components/admin/BeforeLogin#BeforeLogin'],
    },
  },
  collections: [Packages, Destinations, Cruises, Testimonials, Leads, Media, Users],
  globals: [SiteSettings],
  plugins: storagePlugins,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // Schema is managed by committed migrations (`src/migrations`), never live
    // dev-push. Push is disabled so the many processes that touch the DB (dev
    // server, seed CLI, tests) share one deterministic schema — repeated dev
    // pushes across processes corrupt the primary key. Run `npm run migrate`
    // (or seed/tests, which migrate first) to apply.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
})
