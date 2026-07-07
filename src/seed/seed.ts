import 'dotenv/config'

import { getPayloadClient } from '../lib/payload'
import { seedContent } from './seedContent'

/**
 * CLI entry point: `npm run seed`. Seeds the local database configured by
 * DATABASE_URI with all launch content, importing images over the network.
 * Idempotent — safe to run repeatedly.
 */
const run = async () => {
  const payload = await getPayloadClient()
  // Ensure the schema exists (idempotent) before writing content.
  await payload.db.migrate()
  const result = await seedContent(payload)
  payload.logger.info(
    `Seeded ${result.destinations} Destinations, ${result.packages} Packages, ` +
      `${result.cruises} Cruises, ${result.media} Media.`,
  )
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
