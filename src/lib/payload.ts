import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

/**
 * Returns the Payload local-API client (Payload memoises the instance per
 * config, so this is safe to call anywhere). All server-side content access
 * goes through the data layer in `src/server`, which uses this helper — pages
 * never import Payload directly.
 */
export const getPayloadClient = (): Promise<Payload> => getPayload({ config })
