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
    <ul className="grid auto-rows-[minmax(9rem,auto)] grid-cols-1 gap-4 sm:auto-rows-[minmax(150px,1fr)] sm:grid-cols-3">
      {SERVICES.map((service, i) => {
        // The feature tile (Curated Packages) uses the world-map backdrop.
        const feature = i === 0
        return (
          <li key={service.title} className={TILE_SPAN[i]}>
            <RevealOnScroll delay={i * 0.06} className="h-full">
              <div
                className={cn(
                  'relative flex h-full flex-col overflow-hidden rounded-2xl p-6 shadow-soft',
                  feature ? 'justify-end' : 'bg-card',
                )}
              >
                {feature && (
                  <>
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: "url('/curated-packages.png')" }}
                    />
                    {/* Cream gradient only at the very bottom keeps the text
                        legible while letting the map show clearly. */}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-cream via-cream/25 to-transparent"
                    />
                  </>
                )}
                <div className="relative">
                  <service.icon className="size-8 text-sea" aria-hidden />
                  <h3
                    className={cn(
                      'mt-4 font-display text-ink',
                      feature ? 'text-2xl sm:text-3xl' : 'text-xl',
                    )}
                  >
                    {service.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/80">
                    {service.body}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </li>
        )
      })}
    </ul>
  )
}
