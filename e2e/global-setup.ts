import 'dotenv/config'

import { getPayloadClient } from '../src/lib/payload'
import { seedContent } from '../src/seed/seedContent'
import { fakeImageFetcher } from '../test/fake-image'

/**
 * Seeds the dev database before the smoke suite runs, so the pages have real
 * content to render. Uses the offline fake image fetcher so the smoke run never
 * depends on the network. Idempotent, so repeated runs are safe.
 */
export default async function globalSetup() {
  const payload = await getPayloadClient()
  await payload.db.migrate()
  await seedContent(payload, { fetchImage: fakeImageFetcher })
}
