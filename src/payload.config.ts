import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Cruises } from './collections/Cruises'
import { Destinations } from './collections/Destinations'
import { Media } from './collections/Media'
import { Packages } from './collections/Packages'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Packages, Destinations, Cruises, Media, Users],
  globals: [SiteSettings],
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
