import path from 'path'
import { fileURLToPath } from 'url'

import dotenv from 'dotenv'
import { defineConfig } from 'vitest/config'

dotenv.config()

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Integration tests run against an isolated test database so they never touch
// dev/prod content. By default `test/global-setup.ts` boots a throwaway
// embedded Postgres on this fixed URI. To run against an external managed
// Postgres instead, set DATABASE_URI_TEST and remove the globalSetup.
const testDatabaseUri =
  process.env.DATABASE_URI_TEST ??
  'postgres://postgres:postgres@localhost:54329/safar_test'

export default defineConfig({
  resolve: {
    alias: {
      '@payload-config': path.resolve(dirname, 'src/payload.config.ts'),
      '@': path.resolve(dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.int.test.ts'],
    globalSetup: ['./test/global-setup.ts'],
    // Payload's local API + drizzle schema push is slow to warm up.
    hookTimeout: 180_000,
    testTimeout: 60_000,
    // A single Payload instance/connection avoids workers racing on the DB.
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
    env: {
      DATABASE_URI: testDatabaseUri,
      PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ?? 'test-secret',
    },
  },
})
