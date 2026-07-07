import 'dotenv/config'

import { getPayloadClient } from '../lib/payload'
import { seedPackages } from './seedPackages'

/**
 * CLI entry point: `npm run seed`. Seeds the local database configured by
 * DATABASE_URI. Idempotent — safe to run repeatedly.
 */
const run = async () => {
  const payload = await getPayloadClient()
  // Ensure the schema exists (idempotent) before writing content.
  await payload.db.migrate()
  const count = await seedPackages(payload)
  payload.logger.info(`Seeded ${count} Packages.`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
