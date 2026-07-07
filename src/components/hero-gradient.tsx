import { cn } from '@/lib/utils'

type HeroGradientProps = {
  /** Tailwind gradient classes for the panel (e.g. `bg-gradient-to-br …`). */
  className?: string
  /** Adds a wide sea-tinted glow along the bottom (used on the tall home hero). */
  glow?: boolean
}

/**
 * The Sea & Sand hero backdrop: a soft gradient panel with a warm "sun" blur,
 * used as the subject inside `KenBurns` so the slow pan/zoom reads clearly
 * without depending on photo assets (rights unresolved — PRD open items).
 */
export function HeroGradient({ className, glow = false }: HeroGradientProps) {
  return (
    <div className={cn('relative h-full w-full', className)}>
      <div className="absolute right-[11%] top-[18%] h-56 w-56 rounded-full bg-gold/40 blur-3xl" />
      {glow && (
        <div className="absolute -bottom-24 left-1/2 h-96 w-[140%] -translate-x-1/2 rounded-[100%] bg-sea/10 blur-3xl" />
      )}
    </div>
  )
}
