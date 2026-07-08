import { CruiseCard } from '@/components/cards/cruise-card'
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
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cruises.map((cruise, i) => (
            <li key={cruise.id}>
              <RevealOnScroll delay={(i % 3) * 0.06}>
                <CruiseCard cruise={cruise} />
              </RevealOnScroll>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
