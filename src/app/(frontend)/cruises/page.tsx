import { CruiseCard } from '@/components/cards/cruise-card'
import { FeatureTile } from '@/components/cards/feature-tile'
import { RevealOnScroll } from '@/components/motion'
import { pageMetadata } from '@/lib/seo'
import { listCruises } from '@/server/cruises'

export const metadata = pageMetadata({
  title: 'Cruises',
  description: 'Browse Mediterranean cruises from Safar Travel & Tourism.',
  path: '/cruises',
})

// Content is CMS-driven; render fresh so newly-published Cruises appear.
export const dynamic = 'force-dynamic'

export default async function CruisesPage() {
  const cruises = await listCruises()

  return (
    <div className="mx-auto max-w-content px-6 py-section">
      <RevealOnScroll>
        <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">
          Sea voyages
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Cruises</h1>
      </RevealOnScroll>

      {cruises.length === 0 ? (
        <p className="mt-6 text-lg text-ink/70">No Cruises yet. Check back soon.</p>
      ) : (
        <div className="mt-12 space-y-6">
          <RevealOnScroll>
            <FeatureTile
              href={`/cruises/${cruises[0].slug}`}
              image={cruises[0].heroImage}
              eyebrow={cruises[0].country}
              title={cruises[0].title}
              meta={`${cruises[0].duration} · Starting $${cruises[0].startingPrice}`}
            />
          </RevealOnScroll>
          {cruises.length > 1 && (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cruises.slice(1).map((cruise, i) => (
                <li key={cruise.id}>
                  <RevealOnScroll delay={(i % 3) * 0.06}>
                    <CruiseCard cruise={cruise} />
                  </RevealOnScroll>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
