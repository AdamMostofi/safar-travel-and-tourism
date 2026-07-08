import { PackagesBrowser } from '@/components/packages/packages-browser'
import { RevealOnScroll } from '@/components/motion'
import { pageMetadata } from '@/lib/seo'
import { listPackages } from '@/server/packages'

export const metadata = pageMetadata({
  title: 'Packages',
  description: 'Browse curated travel Packages from Safar Travel & Tourism.',
  path: '/packages',
})

// Content is CMS-driven; render fresh so newly-published Packages appear.
export const dynamic = 'force-dynamic'

export default async function PackagesPage() {
  const packages = await listPackages()

  return (
    <div className="mx-auto max-w-content px-6 py-section">
      <RevealOnScroll>
        <p className="font-body text-sm uppercase tracking-[0.2em] text-sea">
          Curated journeys
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Packages</h1>
      </RevealOnScroll>

      {packages.length === 0 ? (
        <p className="mt-6 text-lg text-ink/70">No Packages yet. Check back soon.</p>
      ) : (
        <div className="mt-12">
          <PackagesBrowser packages={packages} />
        </div>
      )}
    </div>
  )
}
