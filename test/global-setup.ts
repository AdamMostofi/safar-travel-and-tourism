import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'

import EmbeddedPostgres from 'embedded-postgres'

/**
 * Vitest global setup: boots a real, throwaway PostgreSQL server for the
 * integration suite so tests run anywhere without Docker or a system Postgres.
 * The connection string is pinned in `vitest.config.ts` (env.DATABASE_URI) to
 * match the fixed port and credentials below.
 *
 * In a CI/deploy environment with a managed Postgres, point DATABASE_URI_TEST
 * at it and run against that instead (see docker-compose.yml / README).
 */
const PORT = 54329
const USER = 'postgres'
const PASSWORD = 'postgres'
const DB = 'safar_test'

let pg: EmbeddedPostgres
let dataDir: string

export async function setup() {
  dataDir = mkdtempSync(path.join(tmpdir(), 'safar-pg-'))
  pg = new EmbeddedPostgres({
    databaseDir: dataDir,
    user: USER,
    password: PASSWORD,
    port: PORT,
    persistent: false,
  })
  await pg.initialise()
  await pg.start()
  await pg.createDatabase(DB)
}

export async function teardown() {
  try {
    if (pg) await pg.stop()
  } finally {
    if (dataDir) rmSync(dataDir, { recursive: true, force: true })
  }
}
