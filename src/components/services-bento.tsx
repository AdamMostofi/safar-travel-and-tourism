import { RevealOnScroll } from '@/components/motion'
import { SERVICES } from '@/lib/services'
import { cn } from '@/lib/utils'

/**
 * The services overview as an asymmetric bento (issue #12): varied tile sizes
 * with a colour "feature" tile, replacing the row of four identical cards.
 * Shared by the home and About pages; content comes from the shared SERVICES.
 */
const TILE_SPAN = [
  'sm:col-span-2 sm:row-span-2', // feature (large)
  'sm:col-span-1',
  'sm:col-span-1',
  'sm:col-span-3', // full-width banner
]

export function ServicesBento() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:auto-rows-[minmax(150px,1fr)]">
      {SERVICES.map((service, i) => {
        const feature = i === 0
        return (
          <li key={service.title} className={TILE_SPAN[i]}>
            <RevealOnScroll delay={i * 0.06} className="h-full">
              <div
                className={cn(
                  'flex h-full flex-col rounded-2xl p-6 shadow-soft',
                  feature
                    ? 'justify-end bg-gradient-to-br from-sea to-sea/85 text-cream'
                    : 'bg-card',
                )}
              >
                <service.icon
                  className={cn('size-8', feature ? 'text-cream' : 'text-sea')}
                  aria-hidden
                />
                <h3
                  className={cn(
                    'mt-4 font-display',
                    feature ? 'text-2xl text-cream sm:text-3xl' : 'text-xl text-ink',
                  )}
                >
                  {service.title}
                </h3>
                <p
                  className={cn(
                    'mt-2 max-w-md text-sm leading-relaxed',
                    feature ? 'text-cream' : 'text-ink/70',
                  )}
                >
                  {service.body}
                </p>
              </div>
            </RevealOnScroll>
          </li>
        )
      })}
    </ul>
  )
}
