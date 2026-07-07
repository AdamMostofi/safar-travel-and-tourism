/**
 * Seed content for the tracer slice: two real Packages transcribed from the
 * crawled source under `content/crawl/`. Later slices replace this with the
 * full import of all ~25 Packages, Destinations, and Cruises (PRD story 37).
 */
export type PackageSeed = {
  title: string
  slug: string
  country: string
  duration: string
  startingPrice: number
  information: string
}

export const packageSeeds: PackageSeed[] = [
  {
    title: 'Get the Best out of Maldives',
    slug: 'maldives',
    country: 'Maldives',
    duration: '5 Days 4 Nights',
    startingPrice: 1299,
    information:
      'The Maldives, a tropical paradise in the Indian Ocean, is a dream destination for tourists seeking tranquility and luxury. Known for its pristine white-sand beaches, crystal-clear turquoise waters, and vibrant coral reefs, it offers an idyllic setting for relaxation and adventure. Visitors can enjoy world-class snorkeling, diving, and water sports, or simply unwind in luxurious overwater bungalows.',
  },
  {
    title: 'Classic Italy Tour',
    slug: 'classic-italy-tour',
    country: 'Italy',
    duration: '7 Days 6 Nights',
    startingPrice: 1049,
    information:
      'Italy, a captivating country in southern Europe, is a top destination for tourists seeking rich history, culture, and cuisine. From the ancient ruins of Rome and the romantic canals of Venice to the art treasures of Florence and the stunning Amalfi Coast, Italy offers endless experiences.',
  },
]
