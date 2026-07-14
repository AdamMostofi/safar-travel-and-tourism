import { Inbox, LineChart, Luggage, MapPin, Quote, Ship } from 'lucide-react'

import { getGaSummary } from '@/lib/analytics'
import { getDashboardMetrics } from '@/server/dashboardMetrics'

const numberFmt = new Intl.NumberFormat('en-US')

/**
 * The metrics band at the top of the Safar admin dashboard: live counts of the
 * catalogue and incoming enquiries so staff see the shape of the site at a
 * glance. A server component — it reads counts through the Payload local API on
 * render. Sits above `BeforeDashboard`'s navigation cards; styling lives in
 * `custom.scss` (`.safar-overview*`) since the admin bundle has no Tailwind.
 *
 * Includes a Google Analytics traffic panel; it self-hides gracefully when GA
 * credentials aren't configured (see `@/lib/analytics`).
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

  // GA is optional and already fails safe to null; render a traffic panel when
  // it's configured, a short "not set up" note otherwise.
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

      <div className="safar-traffic">
        <h3 className="safar-traffic__title">
          <LineChart size={16} aria-hidden="true" />
          Website traffic
          {ga ? <span className="safar-traffic__range">last {ga.rangeDays} days</span> : null}
        </h3>

        {ga ? (
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
            </div>

            {ga.topPages.length > 0 ? (
              <ol className="safar-traffic__pages">
                {ga.topPages.map((page) => (
                  <li key={page.path} className="safar-traffic__page">
                    <span className="safar-traffic__page-title">{page.title || page.path}</span>
                    <span className="safar-traffic__page-path">{page.path}</span>
                    <span className="safar-traffic__page-views">
                      {numberFmt.format(page.views)}
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}
          </>
        ) : (
          <p className="safar-traffic__empty">
            Google Analytics isn’t connected yet. Once the GA property ID and service-account key
            are set, visitor numbers will appear here automatically.
          </p>
        )}
      </div>
    </section>
  )
}
