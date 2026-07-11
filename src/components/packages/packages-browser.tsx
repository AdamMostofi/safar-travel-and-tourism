'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

import { PackageGrid } from '@/components/cards/package-grid'
import type { PackageListItem } from '@/server/packages'

const ALL = '__all__'

type Filter = { slug: string; name: string; count: number }

/**
 * The `/packages` browser: a search box (Package name / country) and a
 * Destination filter dropdown, applied client-side over the Packages passed in.
 * Destination options are derived from the Packages themselves, so only
 * Destinations that actually have Packages appear (each with its count).
 * Results and a live count update in place; cards keep their hover-lift and
 * reveal motion.
 */
export function PackagesBrowser({ packages }: { packages: PackageListItem[] }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<string>(ALL)

  const filters = useMemo<Filter[]>(() => {
    const byslug = new Map<string, Filter>()
    for (const pkg of packages) {
      const dest = pkg.destination
      if (!dest) continue
      const existing = byslug.get(dest.slug)
      if (existing) existing.count += 1
      else byslug.set(dest.slug, { slug: dest.slug, name: dest.name, count: 1 })
    }
    return [...byslug.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [packages])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return packages.filter((p) => {
      const matchesDest = active === ALL || p.destination?.slug === active
      const matchesQuery =
        !q || p.title.toLowerCase().includes(q) || p.country.toLowerCase().includes(q)
      return matchesDest && matchesQuery
    })
  }, [packages, query, active])

  const controlClass =
    'rounded-full border border-border bg-card text-sm text-ink focus-visible:border-sea focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/40'

  return (
    <div>
      {/* Search + Destination filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Packages by name or country"
            aria-label="Search Packages by name or country"
            className={`${controlClass} w-full py-2.5 pl-10 pr-4 placeholder:text-ink/50`}
          />
        </div>
        {filters.length > 0 && (
          <div className="relative">
            <select
              value={active}
              onChange={(e) => setActive(e.target.value)}
              aria-label="Filter Packages by Destination"
              className={`${controlClass} w-full appearance-none py-2.5 pl-4 pr-10 sm:w-64`}
            >
              <option value={ALL}>All Destinations ({packages.length})</option>
              {filters.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.name} ({f.count})
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink/50"
              aria-hidden
            />
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-ink/60" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'Package' : 'Packages'}
      </p>

      <div className="mt-6">
        {shown.length === 0 ? (
          <p className="text-lg text-ink/70">
            No Packages match your search. Try a different name, country, or Destination.
          </p>
        ) : (
          <PackageGrid packages={shown} />
        )}
      </div>
    </div>
  )
}
