import { AnimatedCounter, RevealOnScroll } from '@/components/motion'
import type { ProofMetric } from '@/lib/proofMetrics'

/**
 * The proof-metric stat band (issue #12): the trust figures from SiteSettings
 * as a calm row of glassy count-up cards, shared by the home and About pages.
 * Reuses the tested {@link AnimatedCounter} (count-up on scroll-in; jumps to the
 * final value under reduced motion) rather than a second counter implementation.
 */
export function StatBand({ metrics }: { metrics: ProofMetric[] }) {
  if (metrics.length === 0) return null

  return (
    <section className="border-y border-border bg-gradient-to-b from-secondary/50 to-background">
      <div className="mx-auto max-w-content px-6 py-14">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {metrics.map((stat, i) => (
            <li key={stat.key}>
              <RevealOnScroll delay={i * 0.06}>
                <div className="rounded-2xl border border-border bg-card/70 p-6 text-center shadow-soft backdrop-blur">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-display text-4xl text-sea sm:text-5xl"
                  />
                  <p className="mt-2 text-sm text-ink/70">{stat.label}</p>
                </div>
              </RevealOnScroll>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
