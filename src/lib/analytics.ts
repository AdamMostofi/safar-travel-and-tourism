import 'server-only'

import { unstable_cache } from 'next/cache'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

/**
 * Google Analytics summary for the CMS dashboard. We pull a handful of GA4
 * numbers server-side (via the GA Data API and a service account) so the client
 * sees traffic in the admin without logging into Google. Everything degrades
 * gracefully: with no credentials configured, `getGaSummary()` returns `null`
 * and the dashboard shows a "not configured" note instead of erroring.
 *
 * Required env vars (all optional — absence just disables the panel):
 *   GA_PROPERTY_ID          the GA4 *numeric* property ID (not the G-XXXX id)
 *   GA_SERVICE_ACCOUNT_KEY  base64-encoded (or raw) service-account JSON
 */

export type GaTopPage = { path: string; title: string; views: number }

export type GaSummary = {
  activeUsers: number
  sessions: number
  pageViews: number
  topPages: GaTopPage[]
  rangeDays: number
}

const RANGE_DAYS = 28

/** Parse the service-account JSON from base64 (Vercel-friendly) or a raw string. */
function loadCredentials(): { client_email: string; private_key: string } | null {
  const raw = process.env.GA_SERVICE_ACCOUNT_KEY?.trim()
  if (!raw) return null
  try {
    const json = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8')
    const parsed = JSON.parse(json) as { client_email?: string; private_key?: string }
    if (!parsed.client_email || !parsed.private_key) return null
    return { client_email: parsed.client_email, private_key: parsed.private_key }
  } catch {
    return null
  }
}

async function fetchGaSummary(): Promise<GaSummary | null> {
  const propertyId = process.env.GA_PROPERTY_ID?.trim()
  const credentials = loadCredentials()
  if (!propertyId || !credentials) return null

  const client = new BetaAnalyticsDataClient({ credentials })
  const property = `properties/${propertyId}`
  const dateRanges = [{ startDate: `${RANGE_DAYS}daysAgo`, endDate: 'today' }]

  const [totals] = await client.runReport({
    property,
    dateRanges,
    metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }],
  })

  const [pages] = await client.runReport({
    property,
    dateRanges,
    dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 5,
  })

  const totalsRow = totals.rows?.[0]?.metricValues ?? []
  const metric = (i: number) => Number(totalsRow[i]?.value ?? 0)

  const topPages: GaTopPage[] = (pages.rows ?? []).map((row) => ({
    path: row.dimensionValues?.[0]?.value ?? '',
    title: row.dimensionValues?.[1]?.value ?? '',
    views: Number(row.metricValues?.[0]?.value ?? 0),
  }))

  return {
    activeUsers: metric(0),
    sessions: metric(1),
    pageViews: metric(2),
    topPages,
    rangeDays: RANGE_DAYS,
  }
}

/**
 * Cached wrapper: GA numbers move slowly, so refresh at most hourly and never
 * hammer the API on every dashboard render. Any failure resolves to `null`.
 */
export const getGaSummary = unstable_cache(
  async (): Promise<GaSummary | null> => {
    try {
      return await fetchGaSummary()
    } catch {
      return null
    }
  },
  ['ga-summary'],
  { revalidate: 3600 },
)
