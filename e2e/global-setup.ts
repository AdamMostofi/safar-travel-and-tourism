import 'dotenv/config'

import { getPayloadClient } from '../src/lib/payload'
import { seedPackages } from '../src/seed/seedPackages'

/**
 * Seeds the dev database before the smoke suite runs, so the pages have real
 * content to render. Idempotent, so repeated runs are safe.
 */
export default async function globalSetup() {
  const payload = await getPayloadClient()
  await payload.db.migrate()
  await seedPackages(payload)
}
