import { PackageCard } from './package-card'
import { RevealOnScroll } from '@/components/motion'
import type { PackageListItem } from '@/server/packages'

/**
 * The shared responsive grid of Package cards, used by `/packages`, the
 * per-Destination pages, and the client-side filter. Each card reveals on
 * scroll, staggered within its row so a long list doesn't ripple all at once.
 */
export function PackageGrid({ packages }: { packages: PackageListItem[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg, i) => (
        <li key={pkg.id}>
          <RevealOnScroll delay={(i % 3) * 0.06}>
            <PackageCard pkg={pkg} />
          </RevealOnScroll>
        </li>
      ))}
    </ul>
  )
}
