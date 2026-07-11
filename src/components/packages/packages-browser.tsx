'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

import { PackageGrid } from '@/components/cards/package-grid'
import { cn } from '@/lib/utils'
import type { PackageListItem } from '@/server/packages'

const ALL = '__all__'

type Filter = { slug: string; name: string; count: number }
type Sort = 'recommended' | 'price-asc' | 'price-desc' | 'name'

const SORTS: { value: Sort; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Starting Price: low to high' },
  { value: 'price-desc', label: 'Starting Price: high to low' },
  { value: 'name', label: 'Name: A to Z' },
]

/**
 * The `/packages` browser: a search box (Package name / country), a Destination
 * filter, and a sort control, all client-side over the Packages passed in.
 * Destination chips are derived from the Packages themselves, so only
 * Destinations that actually have Packages appear (each with its count).
 * Results update in place; the cards keep their hover-lift and reveal motion.
 */
export function PackagesBrowser({ packages }: { packages: PackageListItem[] }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<string>(ALL)
  const [sort, setSort] = useState<Sort>('recommended')

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
    const filtered = packages.filter((p) => {
      const matchesDest = active === ALL || p.destination?.slug === active
      const matchesQuery =
        !q || p.title.toLowerCase().includes(q) || p.country.toLowerCase().includes(q)
      return matchesDest && matchesQuery
    })
    return filtered.sort((a, b) => {
      if (sort === 'price-asc') return a.startingPrice - b.startingPrice
      if (sort === 'price-desc') return b.startingPrice - a.startingPrice
      if (sort === 'name') return a.title.localeCompare(b.title)
      // recommended: Featured first, then alphabetical
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return a.title.localeCompare(b.title)
    })
  }, [packages, query, active, sort])

  return (
    <div>
      {/* Search + sort */}
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
            className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink/50 focus-visible:border-sea focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/40"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <span className="sr-only sm:not-sr-only">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort Packages"
            className="rounded-full border border-border bg-card px-4 py-2.5 text-sm text-ink focus-visible:border-sea focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/40"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Destination filter */}
      {filters.length > 0 && (
        <div
          role="group"
          aria-label="Filter Packages by Destination"
          className="mt-5 flex flex-wrap gap-2"
        >
          <FilterChip
            label="All"
            count={packages.length}
            selected={active === ALL}
            onSelect={() => setActive(ALL)}
          />
          {filters.map((f) => (
            <FilterChip
              key={f.slug}
              label={f.name}
              count={f.count}
              selected={active === f.slug}
              onSelect={() => setActive(f.slug)}
            />
          ))}
        </div>
      )}

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

function FilterChip({
  label,
  count,
  selected,
  onSelect,
}: {
  label: string
  count: number
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        selected
          ? 'border-sea bg-sea text-cream'
          : 'border-border bg-card text-ink/80 hover:border-sea/60 hover:text-ink',
      )}
    >
      {label}
      <span className={cn('ml-2 text-xs', selected ? 'text-cream' : 'text-ink/70')}>{count}</span>
    </button>
  )
}
