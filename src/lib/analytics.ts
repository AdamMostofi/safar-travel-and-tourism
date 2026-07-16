import 'server-only'

import { unstable_cache } from 'next/cache'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

/**
 * Google Analytics summary for the CMS dashboard. We pull a set of GA4 numbers
 * server-side (via the GA Data API and a service account) so the client sees a
 * meaningful traffic snapshot in the admin without logging into Google. It's a
 * summary, not a replacement for GA — a "View full report" link goes to GA for
 * deep analysis.
 *
 * Everything degrades gracefully: with no credentials configured, `getGaSummary()`
 * returns `null` and the dashboard shows a "not connected" note. Individual
 * secondary reports (channels, devices, trend, …) fail soft to empty so one bad
 * query never blanks the whole panel.
 *
 * Required env vars (all optional — absence disables the panel):
 *   GA_PROPERTY_ID          the GA4 *numeric* property ID (not the G-XXXX id)
 *   GA_SERVICE_ACCOUNT_KEY  base64-encoded (or raw) service-account JSON
 */

export type GaNamedCount = { label: string; value: number }
export type GaTopPage = { path: string; title: string; views: number }
export type GaTrendPoint = { date: string; sessions: number }

export type GaSummary = {
  rangeDays: number
  propertyId: string
  // Headline totals
  activeUsers: number
  sessions: number
  pageViews: number
  avgEngagementSeconds: number
  engagementRate: number // 0..1
  newUsers: number
  returningUsers: number
  // Breakdowns
  channels: GaNamedCount[]
  devices: GaNamedCount[]
  topPages: GaTopPage[]
  trend: GaTrendPoint[]
}

const RANGE_DAYS = 28
const TREND_DAYS = 14

type Row = { dimensionValues?: ({ value?: string | null } | null)[] | null; metricValues?: ({ value?: string | null } | null)[] | null }

const dim = (row: Row, i: number) => row.dimensionValues?.[i]?.value ?? ''
const met = (row: Row, i: number) => Number(row.metricValues?.[i]?.value ?? 0)

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

/** Pretty labels for GA's newVsReturning dimension values. */
function isReturning(value: string): boolean {
  return value.toLowerCase().startsWith('return')
}

async function fetchGaSummary(): Promise<GaSummary | null> {
  const propertyId = process.env.GA_PROPERTY_ID?.trim()
  const credentials = loadCredentials()
  if (!propertyId || !credentials) return null

  const client = new BetaAnalyticsDataClient({ credentials })
  const property = `properties/${propertyId}`
  const dateRanges = [{ startDate: `${RANGE_DAYS}daysAgo`, endDate: 'today' }]

  // Secondary reports fail soft to an empty result so the panel still renders.
  const soft = <T>(p: Promise<T>): Promise<T | null> => p.then((r) => r).catch(() => null)

  const [totals, newReturning, channels, devices, pages, trend] = await Promise.all([
    // Core totals — if this throws, the whole panel falls back to "not connected".
    client.runReport({
      property,
      dateRanges,
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'engagementRate' },
      ],
    }),
    soft(
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'newVsReturning' }],
        metrics: [{ name: 'activeUsers' }],
      }),
    ),
    soft(
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 6,
      }),
    ),
    soft(
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      }),
    ),
    soft(
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 5,
      }),
    ),
    soft(
      client.runReport({
        property,
        dateRanges: [{ startDate: `${TREND_DAYS}daysAgo`, endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
    ),
  ])

  const t = totals[0]?.rows?.[0]
  const totalsRow: Row = t ?? {}

  let newUsers = 0
  let returningUsers = 0
  for (const row of newReturning?.[0]?.rows ?? []) {
    const users = met(row, 0)
    if (isReturning(dim(row, 0))) returningUsers += users
    else newUsers += users
  }

  const channelRows: GaNamedCount[] = (channels?.[0]?.rows ?? []).map((row) => ({
    label: dim(row, 0) || 'Unassigned',
    value: met(row, 0),
  }))

  const deviceRows: GaNamedCount[] = (devices?.[0]?.rows ?? []).map((row) => ({
    label: dim(row, 0) || 'Unknown',
    value: met(row, 0),
  }))

  const topPages: GaTopPage[] = (pages?.[0]?.rows ?? []).map((row) => ({
    path: dim(row, 0),
    title: dim(row, 1),
    views: met(row, 0),
  }))

  const trendPoints: GaTrendPoint[] = (trend?.[0]?.rows ?? []).map((row) => ({
    date: dim(row, 0),
    sessions: met(row, 0),
  }))

  return {
    rangeDays: RANGE_DAYS,
    propertyId,
    activeUsers: met(totalsRow, 0),
    sessions: met(totalsRow, 1),
    pageViews: met(totalsRow, 2),
    avgEngagementSeconds: met(totalsRow, 3),
    engagementRate: met(totalsRow, 4),
    newUsers,
    returningUsers,
    channels: channelRows,
    devices: deviceRows,
    topPages,
    trend: trendPoints,
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
  // The version suffix busts the on-disk cache whenever the summary shape
  // changes, so a stale-shaped payload is never served after a deploy.
  ['ga-summary-v2'],
  { revalidate: 3600 },
)
