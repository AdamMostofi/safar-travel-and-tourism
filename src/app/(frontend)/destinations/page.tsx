import { DestinationCard } from '@/components/cards/destination-card'
import { FeatureTile } from '@/components/cards/feature-tile'
import { RevealOnScroll } from '@/components/motion'
import { pageMetadata } from '@/lib/seo'
import { listDestinations } from '@/server/destinations'

export const metadata = pageMetadata({
  title: 'Destinations',
  description: 'Explore the places Safar Travel & Tourism sells trips to.',
  path: '/destinations',
})

// Content is CMS-driven; render fresh so newly-published Destinations appear.
export const dynamic = 'force-dynamic'

export default async function DestinationsPage() {
  const destinations = await listDestinations()

  return (
    <div className="mx-auto max-w-content px-6 py-section">
      <RevealOnScroll>
        <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">
          Where we go
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Destinations</h1>
      </RevealOnScroll>

      {destinations.length === 0 ? (
        <p className="mt-6 text-lg text-ink/70">No Destinations yet. Check back soon.</p>
      ) : (
        <div className="mt-12 space-y-6">
          <RevealOnScroll>
            <FeatureTile
              href={`/destinations/${destinations[0].slug}`}
              image={destinations[0].heroImage}
              eyebrow="Destination"
              title={destinations[0].name}
            />
          </RevealOnScroll>
          {destinations.length > 1 && (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {destinations.slice(1).map((destination, i) => (
                <li key={destination.id}>
                  <RevealOnScroll delay={(i % 4) * 0.05}>
                    <DestinationCard destination={destination} />
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
