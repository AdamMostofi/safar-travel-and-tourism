import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-4xl text-sea">Safar Travel &amp; Tourism</h1>
      <p className="mt-4 text-lg">
        Curated trips from a trusted Beirut travel agency. This is the tracer
        skeleton — the home page and full experience arrive in later slices.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/packages">Browse Packages</Link>
      </Button>
    </div>
  )
}
