'use client'

import { useMemo, useState } from 'react'

import { PackageGrid } from '@/components/cards/package-grid'
import { cn } from '@/lib/utils'
import type { PackageListItem } from '@/server/packages'

const ALL = '__all__'

type Filter = { slug: string; name: string; count: number }

/**
 * The `/packages` grid with client-side grouping/filtering by Destination.
 * Filter chips are derived from the Packages themselves, so only Destinations
 * that actually have Packages appear (each with its count). Selecting a chip
 * narrows the grid in place; the cards keep their hover-lift and reveal motion.
 */
export function PackagesBrowser({ packages }: { packages: PackageListItem[] }) {
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

  const shown =
    active === ALL
      ? packages
      : packages.filter((p) => p.destination?.slug === active)

  return (
    <div>
      {filters.length > 0 && (
        <div
          role="group"
          aria-label="Filter Packages by Destination"
          className="flex flex-wrap gap-2"
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

      <div className="mt-10">
        {shown.length === 0 ? (
          <p className="text-lg text-ink/70">No Packages match this Destination.</p>
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
      <span className={cn('ml-2 text-xs', selected ? 'text-cream/70' : 'text-ink/50')}>
        {count}
      </span>
    </button>
  )
}
