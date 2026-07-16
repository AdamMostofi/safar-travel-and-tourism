import { ExternalLink, Inbox, LineChart, Luggage, MapPin, Quote, Ship } from 'lucide-react'

import { type GaNamedCount, type GaSummary, type GaTopPage, getGaSummary } from '@/lib/analytics'
import { getDashboardMetrics } from '@/server/dashboardMetrics'

const numberFmt = new Intl.NumberFormat('en-US')

function formatDuration(seconds: number): string {
  const s = Math.round(seconds)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  return `${m}m ${s % 60}s`
}

/** A tiny inline sparkline of daily sessions (last 14 days). */
function Sparkline({ points }: { points: number[] }) {
  if (points.length === 0) return null
  const w = 260
  const h = 42
  const pad = 3
  const max = Math.max(1, ...points)
  const step = points.length > 1 ? (w - 2 * pad) / (points.length - 1) : 0
  const coords = points
    .map((v, i) => {
      const x = pad + i * step
      const y = h - pad - (v / max) * (h - 2 * pad)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  return (
    <svg
      className="safar-traffic__spark"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Sessions trend, last 14 days"
    >
      <polyline
        points={coords}
        fill="none"
        stroke="var(--safar-sea)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** A labelled bar list (traffic sources, devices). */
function Breakdown({ title, rows }: { title: string; rows: GaNamedCount[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <div className="safar-bd">
      <h4 className="safar-bd__title">{title}</h4>
      {rows.length > 0 ? (
        <ul className="safar-bd__list">
          {rows.map((row) => (
            <li key={row.label} className="safar-bd__row">
              <span className="safar-bd__label">{row.label}</span>
              <span className="safar-bd__track" aria-hidden="true">
                <span className="safar-bd__fill" style={{ width: `${(row.value / max) * 100}%` }} />
              </span>
              <span className="safar-bd__val">{numberFmt.format(row.value)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="safar-bd__empty">No data yet</p>
      )}
    </div>
  )
}

function TopPages({ pages }: { pages: GaTopPage[] }) {
  return (
    <div className="safar-bd">
      <h4 className="safar-bd__title">Top pages</h4>
      {pages.length > 0 ? (
        <ol className="safar-bd__list">
          {pages.map((page) => (
            <li key={page.path} className="safar-bd__row safar-bd__row--page">
              <span className="safar-bd__page">
                <span className="safar-bd__label">{page.title || page.path}</span>
                <span className="safar-bd__sub">{page.path}</span>
              </span>
              <span className="safar-bd__val">{numberFmt.format(page.views)}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="safar-bd__empty">No data yet</p>
      )}
    </div>
  )
}

function TrafficPanel({ ga }: { ga: GaSummary | null }) {
  const gaLink = ga
    ? `https://analytics.google.com/analytics/web/#/p${ga.propertyId}/reports/intelligenthome`
    : null

  return (
    <div className="safar-traffic">
      <h3 className="safar-traffic__title">
        <LineChart size={16} aria-hidden="true" />
        Website traffic
        {ga ? (
          <span className="safar-traffic__meta">
            <span className="safar-traffic__range">last {ga.rangeDays} days</span>
            {gaLink ? (
              <a
                className="safar-traffic__link"
                href={gaLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View full report
                <ExternalLink size={13} aria-hidden="true" />
              </a>
            ) : null}
          </span>
        ) : null}
      </h3>

      {ga ? (
        (() => {
          // Defensive: tolerate any partial/legacy cached payload without crashing.
          const trend = ga.trend ?? []
          const topPages = ga.topPages ?? []
          const channels = ga.channels ?? []
          const devices = ga.devices ?? []
          return (
        <>
          <div className="safar-traffic__metrics">
            <div className="safar-traffic__metric">
              <span className="safar-traffic__value">{numberFmt.format(ga.activeUsers)}</span>
              <span className="safar-traffic__label">Active users</span>
            </div>
            <div className="safar-traffic__metric">
              <span className="safar-traffic__value">{numberFmt.format(ga.sessions)}</span>
              <span className="safar-traffic__label">Sessions</span>
            </div>
            <div className="safar-traffic__metric">
              <span className="safar-traffic__value">{numberFmt.format(ga.pageViews)}</span>
              <span className="safar-traffic__label">Page views</span>
            </div>
            <div className="safar-traffic__metric">
              <span className="safar-traffic__value">{formatDuration(ga.avgEngagementSeconds)}</span>
              <span className="safar-traffic__label">Avg. engagement</span>
            </div>
            <div className="safar-traffic__metric">
              <span className="safar-traffic__value">{Math.round(ga.engagementRate * 100)}%</span>
              <span className="safar-traffic__label">Engagement rate</span>
            </div>
            <div className="safar-traffic__metric">
              <span className="safar-traffic__value">{numberFmt.format(ga.newUsers)}</span>
              <span className="safar-traffic__label">New visitors</span>
              <span className="safar-traffic__hint">
                {numberFmt.format(ga.returningUsers)} returning
              </span>
            </div>
          </div>

          {trend.some((p) => p.sessions > 0) ? (
            <div className="safar-traffic__trend">
              <span className="safar-traffic__trend-label">Sessions · last 14 days</span>
              <Sparkline points={trend.map((p) => p.sessions)} />
            </div>
          ) : null}

          <div className="safar-traffic__breakdowns">
            <TopPages pages={topPages} />
            <Breakdown title="Traffic sources" rows={channels} />
            <Breakdown title="Devices" rows={devices} />
          </div>
        </>
          )
        })()
      ) : (
        <p className="safar-traffic__empty">
          Google Analytics isn’t connected yet. Once the GA property ID and service-account key are
          set, visitor numbers will appear here automatically.
        </p>
      )}
    </div>
  )
}

/**
 * The metrics band at the top of the Safar admin dashboard: live counts of the
 * catalogue and incoming enquiries, plus a Google Analytics traffic snapshot. A
 * server component — it reads counts through the Payload local API and GA numbers
 * through the GA Data API on render. Sits above `BeforeDashboard`'s navigation
 * cards; styling lives in `custom.scss` (`.safar-overview*`, `.safar-traffic*`,
 * `.safar-bd*`) since the admin bundle has no Tailwind. The GA panel self-hides
 * gracefully when credentials aren't configured (see `@/lib/analytics`).
 */
export async function DashboardOverview() {
  let stats: { icon: typeof Luggage; label: string; value: number; href: string; hint?: string }[]

  try {
    const m = await getDashboardMetrics()
    stats = [
      { icon: Luggage, label: 'Packages', value: m.packages, href: '/admin/collections/packages' },
      { icon: Ship, label: 'Cruises', value: m.cruises, href: '/admin/collections/cruises' },
      {
        icon: MapPin,
        label: 'Destinations',
        value: m.destinations,
        href: '/admin/collections/destinations',
      },
      {
        icon: Quote,
        label: 'Testimonials',
        value: m.testimonials,
        href: '/admin/collections/testimonials',
      },
      {
        icon: Inbox,
        label: 'Enquiries',
        value: m.leadsTotal,
        href: '/admin/collections/leads',
        hint: `${m.leadsRecent} new in the last 30 days`,
      },
    ]
  } catch {
    // Counts are a convenience; never let a query hiccup break the dashboard.
    return null
  }

  // GA is optional and already fails safe to null.
  const ga = await getGaSummary()

  return (
    <section className="safar-overview" aria-label="Site overview">
      <h2 className="safar-overview__title">Overview</h2>
      <div className="safar-overview__grid">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <a key={stat.label} className="safar-overview__stat" href={stat.href}>
              <span className="safar-overview__icon">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="safar-overview__value">{stat.value}</span>
              <span className="safar-overview__label">{stat.label}</span>
              {stat.hint ? <span className="safar-overview__hint">{stat.hint}</span> : null}
            </a>
          )
        })}
      </div>

      <TrafficPanel ga={ga} />
    </section>
  )
}
