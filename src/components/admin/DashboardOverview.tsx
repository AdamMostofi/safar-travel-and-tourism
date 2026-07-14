import { Inbox, Luggage, MapPin, Quote, Ship } from 'lucide-react'

import { getDashboardMetrics } from '@/server/dashboardMetrics'

/**
 * The metrics band at the top of the Safar admin dashboard: live counts of the
 * catalogue and incoming enquiries so staff see the shape of the site at a
 * glance. A server component — it reads counts through the Payload local API on
 * render. Sits above `BeforeDashboard`'s navigation cards; styling lives in
 * `custom.scss` (`.safar-overview*`) since the admin bundle has no Tailwind.
 *
 * The Google Analytics traffic panel is appended here in a later change.
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
    </section>
  )
}
