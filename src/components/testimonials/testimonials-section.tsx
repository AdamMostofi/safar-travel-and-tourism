import { TestimonialsCarousel } from '@/components/testimonials/testimonials-carousel'
import { RevealOnScroll } from '@/components/motion'
import { listFeaturedTestimonials } from '@/server/testimonials'

/**
 * The "what travellers say" section (issue #12): the Featured Testimonials from
 * the CMS in a carousel. Renders nothing when there are none, so the page stays
 * clean before any testimonials are published. Shared by the home and About
 * pages.
 */
export async function TestimonialsSection() {
  const testimonials = await listFeaturedTestimonials()
  if (testimonials.length === 0) return null

  return (
    <section className="bg-secondary/30">
      <div className="mx-auto max-w-content px-6 py-section">
        <RevealOnScroll>
          <p className="text-center font-body text-sm uppercase tracking-[0.2em] text-sea">
            Kind words
          </p>
          <h2 className="mt-3 text-center font-display text-3xl text-ink sm:text-4xl">
            Travellers on Safar
          </h2>
        </RevealOnScroll>
        <div className="mt-10">
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </div>
    </section>
  )
}
