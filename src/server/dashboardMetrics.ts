import { getPayloadClient } from '../lib/payload'

/** Counts shown on the admin dashboard overview band. */
export type DashboardMetrics = {
  packages: number
  cruises: number
  destinations: number
  testimonials: number
  /** All enquiries ever captured. */
  leadsTotal: number
  /** Enquiries captured in the last 30 days — the "needs follow-up" signal. */
  leadsRecent: number
}

const RECENT_WINDOW_DAYS = 30

/**
 * At-a-glance counts for the CMS dashboard so non-technical staff see the size
 * of their catalogue and incoming enquiries without opening each list. Runs
 * through the Payload local API (`count`), so it respects the same data layer as
 * the rest of the site and adds only lightweight COUNT queries.
 *
 * Leads have no status field, so "recent" is derived from `createdAt` rather
 * than a read/unread flag.
 */
export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const payload = await getPayloadClient()

  const recentCutoff = new Date(
    Date.now() - RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString()

  const [packages, cruises, destinations, testimonials, leadsTotal, leadsRecent] =
    await Promise.all([
      payload.count({ collection: 'packages' }),
      payload.count({ collection: 'cruises' }),
      payload.count({ collection: 'destinations' }),
      payload.count({ collection: 'testimonials' }),
      payload.count({ collection: 'leads' }),
      payload.count({
        collection: 'leads',
        where: { createdAt: { greater_than_equal: recentCutoff } },
      }),
    ])

  return {
    packages: packages.totalDocs,
    cruises: cruises.totalDocs,
    destinations: destinations.totalDocs,
    testimonials: testimonials.totalDocs,
    leadsTotal: leadsTotal.totalDocs,
    leadsRecent: leadsRecent.totalDocs,
  }
}
