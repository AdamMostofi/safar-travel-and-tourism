import path from 'path'
import { fileURLToPath } from 'url'

import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Fast, dependency-free unit tests for pure logic (no Payload, no Postgres).
// Integration tests (`*.int.test.ts`) live under the separate `vitest.config.ts`
// which boots an embedded Postgres; unit tests must never need a database.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.unit.test.ts'],
  },
})
