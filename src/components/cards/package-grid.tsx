import { FeatureTile } from './feature-tile'
import { PackageCard } from './package-card'
import { RevealOnScroll } from '@/components/motion'
import type { PackageListItem } from '@/server/packages'

/**
 * The shared editorial grid of Packages, used by `/packages`, the
 * per-Destination pages, and the client-side filter. The first Package leads as
 * a wide feature tile; the rest follow as a responsive card grid, so the list
 * reads as a spread rather than a uniform wall. Each item reveals on scroll.
 */
export function PackageGrid({ packages }: { packages: PackageListItem[] }) {
  if (packages.length === 0) return null

  const [lead, ...rest] = packages

  return (
    <div className="space-y-6">
      <RevealOnScroll>
        <FeatureTile
          href={`/packages/${lead.slug}`}
          image={lead.heroImage}
          eyebrow={lead.country}
          title={lead.title}
          meta={`${lead.duration} · Starting $${lead.startingPrice}`}
        />
      </RevealOnScroll>

      {rest.length > 0 && (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((pkg, i) => (
            <li key={pkg.id}>
              <RevealOnScroll delay={(i % 3) * 0.06}>
                <PackageCard pkg={pkg} />
              </RevealOnScroll>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
