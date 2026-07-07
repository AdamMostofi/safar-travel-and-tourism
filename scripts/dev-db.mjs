// Starts a local PostgreSQL for development without Docker, using the same
// bundled Postgres binary the tests use. Connection details are read from
// DATABASE_URI in .env. Keeps running until interrupted (Ctrl+C).
//
// Prefer `npm run db:up` (docker-compose) if you have Docker; this is the
// Docker-less alternative.
import 'dotenv/config'

import { existsSync, mkdirSync } from 'fs'
import path from 'path'

import EmbeddedPostgres from 'embedded-postgres'

const uri = process.env.DATABASE_URI
if (!uri) {
  console.error('DATABASE_URI is not set (copy .env.example to .env).')
  process.exit(1)
}

const parsed = new URL(uri)
const database = parsed.pathname.replace(/^\//, '')
const dataDir = path.resolve('.dev-postgres')
const firstRun = !existsSync(dataDir)
if (firstRun) mkdirSync(dataDir, { recursive: true })

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: decodeURIComponent(parsed.username),
  password: decodeURIComponent(parsed.password),
  port: Number(parsed.port || 5432),
  persistent: true,
})

if (firstRun) await pg.initialise()
await pg.start()
if (firstRun) {
  await pg.createDatabase(database)
}

console.log(`Postgres ready on ${parsed.host}:${parsed.port}/${database}. Ctrl+C to stop.`)

const shutdown = async () => {
  await pg.stop()
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
