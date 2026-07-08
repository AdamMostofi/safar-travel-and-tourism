/**
 * The real launch content, transcribed from the crawled source under
 * `content/crawl/` (PRD story 37): all 12 Destinations, 17 Packages, 3 Cruises,
 * and the global Site Settings.
 *
 * Image fields hold the original `bo.safartravelandtourism.com` URLs; the seed
 * routine (`seedContent`) imports each into the Media collection. URLs are kept
 * exactly as crawled (already URL-encoded where needed).
 */

const PKG = 'https://bo.safartravelandtourism.com/Uploads/Package/'
const DEST = 'https://bo.safartravelandtourism.com/Uploads/Destination/'

/** The "Price Includes" list every priced Package on the source site shares. */
const STANDARD_INCLUSIONS = [
  'Accommodation',
  'Tickets',
  'Insurance',
  'Transportation to/from airport',
]

export type DestinationSeed = {
  name: string
  slug: string
  heroImage: string
  featured: boolean
}

export type PackageSeed = {
  title: string
  slug: string
  country: string
  /** Slug of the Destination this Package is grouped under. */
  destinationSlug: string
  duration: string
  startingPrice: number
  information: string
  inclusions: string[]
  heroImage: string
  gallery: string[]
  featured: boolean
}

export type CruiseSeed = {
  title: string
  slug: string
  country: string
  duration: string
  startingPrice: number
  information: string
  heroImage: string
  gallery: string[]
  featured: boolean
}

export type SiteSettingsSeed = {
  mobiles: string[]
  landline: string
  email: string
  address: string
  whatsapp: string
  socials: {
    instagram: string
    facebook: string
  }
  proofMetrics: {
    yearsExperience: number
    destinationsCount: number
    flightBookings: number
    amazingTours: number
    happyClients: number
    cruisesBookings: number
  }
  footerTagline: string
}

/** The 12 Destinations; the first six are Featured on the home page. */
export const destinationSeeds: DestinationSeed[] = [
  { name: 'Turkey', slug: 'turkey', heroImage: `${DEST}turkey1.jpg`, featured: true },
  { name: 'Maldives', slug: 'maldives', heroImage: `${DEST}maldives1.jpg`, featured: true },
  { name: 'Italy', slug: 'italy', heroImage: `${DEST}italy1.jpg`, featured: true },
  { name: 'France', slug: 'france', heroImage: `${DEST}france1.jpg`, featured: true },
  { name: 'Greece', slug: 'greece', heroImage: `${DEST}greece1.jpg`, featured: true },
  { name: 'Egypt', slug: 'egypt', heroImage: `${DEST}egypt.jpg`, featured: true },
  { name: 'Indonesia', slug: 'indonesia', heroImage: `${DEST}indo.jpg`, featured: false },
  { name: 'Spain', slug: 'spain', heroImage: `${DEST}spain.jpg`, featured: false },
  { name: 'Cyprus', slug: 'cyprus', heroImage: `${DEST}cyp.jpg`, featured: false },
  {
    name: 'United Arab Emirates',
    slug: 'united-arab-emirates',
    heroImage: `${DEST}dubai1.jpg`,
    featured: false,
  },
  { name: 'Thailand', slug: 'thailand', heroImage: `${DEST}Thailand.jpg`, featured: false },
  {
    name: 'Georgia and Armenia',
    slug: 'georgia-and-armenia',
    heroImage: `${DEST}georgia.jpg`,
    featured: false,
  },
]

/**
 * The 17 Packages. `featured` marks the five shown under "Popular Tours" on the
 * home page (Marmaris, Maldives, Adana, Classic Italy Tour, Bodrum).
 */
export const packageSeeds: PackageSeed[] = [
  {
    title: 'Maldives',
    slug: 'maldives',
    country: 'Maldives',
    destinationSlug: 'maldives',
    duration: '5 Days 4 Nights',
    startingPrice: 1299,
    information:
      'The Maldives, a tropical paradise in the Indian Ocean, is a dream destination for tourists seeking tranquility and luxury. Known for its pristine white-sand beaches, crystal-clear turquoise waters, and vibrant coral reefs, it offers an idyllic setting for relaxation and adventure. Visitors can enjoy world-class snorkeling, diving, and water sports, or simply unwind in luxurious over water bungalows. With its stunning natural beauty and warm hospitality, the Maldives promises an unforgettable escape for those looking to experience a slice of heaven on earth.',
    inclusions: STANDARD_INCLUSIONS,
    heroImage: `${PKG}package1.jpg`,
    gallery: [`${PKG}g1.jpg`, `${PKG}g2.jpg`, `${PKG}g3.jpg`],
    featured: true,
  },
  {
    title: 'Classic Italy Tour',
    slug: 'classic-italy-tour',
    country: 'Italy',
    destinationSlug: 'italy',
    duration: '7 Days 6 Nights',
    startingPrice: 1049,
    information:
      'Italy, a captivating country in southern Europe, is a top destination for tourists seeking rich history, culture, and cuisine. From the ancient ruins of Rome and the romantic canals of Venice to the art treasures of Florence and the stunning Amalfi Coast, Italy offers endless experiences. Visitors can savor delicious Italian cuisine, explore world-famous landmarks like the Colosseum and the Leaning Tower of Pisa, and enjoy the vibrant atmosphere of cities and charming countryside alike. With its diverse landscapes and timeless charm, Italy promises an unforgettable journey for every traveler.',
    inclusions: STANDARD_INCLUSIONS,
    heroImage: `${PKG}it4.jpg`,
    gallery: [`${PKG}MILAN.jpg`, `${PKG}AMALFICOAST.jpg`, `${PKG}VENCE.jpg`],
    featured: true,
  },
  {
    title: 'Sharm El Sheikh',
    slug: 'sharm-el-sheikh',
    country: 'Egypt',
    destinationSlug: 'egypt',
    duration: '5 Days 4 Nights',
    startingPrice: 449,
    information:
      "Sharm El Sheikh, a stunning resort town on Egypt's Red Sea coast, is a paradise for tourists. Renowned for its crystal-clear waters, vibrant coral reefs, and luxurious resorts, it offers a perfect blend of relaxation and adventure. Visitors can indulge in world-class diving and snorkeling, explore the bustling Naama Bay with its lively nightlife, or simply unwind on the beautiful sandy beaches. With year-round sunshine and a plethora of activities, Sharm El Sheikh promises an unforgettable holiday experience for all.",
    inclusions: STANDARD_INCLUSIONS,
    heroImage: `${PKG}ss.jpg`,
    gallery: [`${PKG}ss1.jpg`, `${PKG}ss2.jpg`, `${PKG}ss3.png`],
    featured: false,
  },
  {
    title: 'Istanbul',
    slug: 'istanbul',
    country: 'Turkey',
    destinationSlug: 'turkey',
    duration: '04 Days ,03 Nights',
    startingPrice: 380,
    information:
      'Istanbul, a vibrant city straddling Europe and Asia, is a fascinating destination for tourists. Known for its rich history and cultural heritage, Istanbul offers a blend of ancient and modern attractions. Visitors can explore iconic landmarks like the Hagia Sophia, the Blue Mosque, and Topkapi Palace, stroll through the bustling Grand Bazaar, and cruise along the scenic Bosphorus Strait. With its lively markets, delicious cuisine, and stunning architecture, Istanbul provides an unforgettable experience for travelers seeking to immerse themselves in a unique and dynamic city.',
    inclusions: STANDARD_INCLUSIONS,
    heroImage: `${PKG}Istanbul.jpg`,
    gallery: [`${PKG}ist1.jpg`, `${PKG}ist2.jpg`, `${PKG}ist3.jpg`],
    featured: false,
  },
  {
    title: 'Bali',
    slug: 'bali',
    country: 'Indonesia',
    destinationSlug: 'indonesia',
    duration: '9 Days 8 Nights',
    startingPrice: 1499,
    information:
      'Bali, an enchanting Indonesian island, is a paradise for tourists and honeymooners alike. Known for its lush landscapes, pristine beaches, and vibrant culture, Bali offers a perfect mix of relaxation and adventure. Couples can enjoy romantic sunsets at Uluwatu, explore the artistic charm of Ubud, or unwind in luxurious beachfront resorts. With activities ranging from spa retreats and yoga sessions to surfing and snorkeling, Bali promises an unforgettable and magical escape for those seeking a serene and captivating destination.',
    inclusions: STANDARD_INCLUSIONS,
    heroImage: `${PKG}balii.jpg`,
    gallery: [
      `${PKG}mon.jpg`,
      `${PKG}temple.jpg`,
      `${PKG}seminyak%20(1).jpg`,
      `${PKG}cretya.jpg`,
      `${PKG}atvbali.jpg`,
    ],
    featured: false,
  },
  {
    title: 'Marmaris',
    slug: 'marmaris',
    country: 'Turkey',
    destinationSlug: 'turkey',
    duration: '04 Days 03 Nights',
    startingPrice: 360,
    information:
      'Marmaris is a versatile destination that caters to a wide range of travelers, from adventure-seekers to families and party-goers, with its stunning natural beauty, historical sites, and diverse array of activities and entertainment.',
    inclusions: STANDARD_INCLUSIONS,
    heroImage: `${PKG}marmaris.jpg`,
    gallery: [`${PKG}mar55].jpg`, `${PKG}mar44.jpg`, `${PKG}mar33.jpg`],
    featured: true,
  },
  {
    title: 'Paris Love',
    slug: 'paris-love',
    country: 'France',
    destinationSlug: 'france',
    duration: '8 Days 7 Nights',
    startingPrice: 1199,
    information:
      "Paris, the City of Light, beckons tourists with its timeless charm and vibrant energy. A stroll along the Seine River reveals iconic landmarks such as the Eiffel Tower standing tall, symbolizing romance and grandeur. Art enthusiasts find solace in the Louvre, home to masterpieces like the Mona Lisa, while Montmartre's cobblestone streets evoke the bohemian spirit of yesteryears. Indulge in exquisite French cuisine at quaint bistros tucked away in charming neighborhoods, and savor the delicate flavors of macarons and croissants. With its blend of history, culture, and culinary delights, Paris captivates the hearts of travelers from around the globe.",
    inclusions: STANDARD_INCLUSIONS,
    heroImage: `${PKG}paris.jpg`,
    gallery: [
      `${PKG}paris5.jpg`,
      `${PKG}paris4.jpg`,
      `${PKG}paris1.jpg`,
      `${PKG}paris6.jpg`,
      `${PKG}paris3.jpg`,
    ],
    featured: false,
  },
  {
    title: 'Santorini & Mykonos',
    slug: 'santorini-mykonos',
    country: 'Greece',
    destinationSlug: 'greece',
    duration: '6 Days 5 Nights',
    startingPrice: 1099,
    information:
      "Santorini and Mykonos, two gems nestled in the Aegean Sea, offer enchanting escapes for tourists seeking sun-kissed shores and picturesque vistas. Santorini's iconic whitewashed buildings perched on cliffs overlook the azure sea, creating a postcard-perfect setting that enchants visitors. Wander through the narrow streets of Oia and Fira, where stunning sunsets paint the sky in hues of pink and orange. Meanwhile, Mykonos exudes a lively energy with its vibrant nightlife and bustling waterfront. Explore the labyrinthine streets of Mykonos Town, adorned with colorful bougainvillea and charming boutiques. Whether lounging on pristine beaches or immersing in the island's rich history and culture, Santorini and Mykonos promise unforgettable experiences for every traveler.",
    inclusions: STANDARD_INCLUSIONS,
    heroImage: `${PKG}santorini.jpg`,
    gallery: [
      `${PKG}santorini1.jpg`,
      `${PKG}santorini4.jpg`,
      `${PKG}santorini3.jpg`,
      `${PKG}santorini2.jpg`,
    ],
    featured: false,
  },
  {
    title: 'Madrid',
    slug: 'madrid',
    country: 'Spain',
    destinationSlug: 'spain',
    duration: '7 Days 6 Nights',
    startingPrice: 1360,
    information:
      "Madrid, the vibrant capital of Spain, captivates tourists with its rich tapestry of culture, history, and modernity. The city's grand boulevards, adorned with elegant architecture and lively plazas, invite visitors to immerse themselves in its bustling atmosphere. Explore the majestic Royal Palace, home to centuries of Spanish royalty, and wander through the enchanting streets of the historic Barrio de las Letras, where literary greats once roamed. Indulge in the vibrant culinary scene, savoring tapas and paella in cozy taverns or trendy rooftop bars. Art aficionados can marvel at masterpieces in the world-renowned Prado Museum, while sports enthusiasts can feel the passion at a lively Real Madrid football match. With its warm hospitality and endless attractions, Madrid promises an unforgettable experience for tourists seeking the essence of Spain.",
    inclusions: STANDARD_INCLUSIONS,
    heroImage: `${PKG}madrid.jpg`,
    gallery: [
      `${PKG}madrid4.jpg`,
      `${PKG}madrid3.jpg`,
      `${PKG}madrid2.jpg`,
      `${PKG}madrid1.jpg`,
    ],
    featured: false,
  },
  {
    title: 'Ayia Napa',
    slug: 'ayia-napa',
    country: 'Cyprus',
    destinationSlug: 'cyprus',
    duration: '4 Days 3 Nights',
    startingPrice: 499,
    information:
      "Cyprus, the jewel of the Mediterranean, beckons tourists with its irresistible blend of sun, sea, and history. The island boasts pristine beaches with crystal-clear waters, perfect for sunbathing or diving into aquatic adventures. Wander through ancient ruins and archaeological sites that speak to Cyprus's rich past, from Greek and Roman settlements to Byzantine churches and medieval castles. Explore the charming villages nestled in the Troodos Mountains, where traditional way of life thrives amidst breathtaking scenery. Indulge in the island's culinary delights, from fresh seafood meze to succulent souvlaki, accompanied by local wines and spirits. With its warm hospitality, vibrant culture, and stunning landscapes, Cyprus promises an unforgettable holiday for every traveler.",
    inclusions: STANDARD_INCLUSIONS,
    heroImage: `${PKG}Ayianapa.jpg`,
    gallery: [`${PKG}an3.jpg`, `${PKG}an2.jpg`, `${PKG}an1.jpg`],
    featured: false,
  },
  {
    title: 'Dubai',
    slug: 'dubai',
    country: 'United Arab Emirates',
    destinationSlug: 'united-arab-emirates',
    duration: '4 Days 3 Nights',
    startingPrice: 450,
    information:
      'Dubai, the dazzling metropolis of the United Arab Emirates, mesmerizes tourists with its futuristic skyline, luxurious shopping malls, and desert adventures. Marvel at the iconic Burj Khalifa, the world\'s tallest building, which pierces the sky with its sleek design and offers panoramic views of the city below. Explore the bustling souks of Old Dubai, where the scent of spices fills the air and intricate textiles beckon shoppers. Indulge in world-class dining experiences, from Michelin-starred restaurants to authentic street food stalls offering shawarma and falafel. For those seeking adventure, desert safaris provide the thrill of dune bashing, camel rides, and traditional Bedouin entertainment under the starlit sky. With its blend of modernity, luxury, and Arabian hospitality, Dubai promises an unforgettable experience for tourists from around the globe.',
    inclusions: STANDARD_INCLUSIONS,
    heroImage: `${PKG}Dubai.jpg`,
    gallery: [
      `${PKG}dubai2.jpg`,
      `${PKG}dubai7.jpg`,
      `${PKG}dubai3.jpg`,
      `${PKG}dubai5.jpg`,
      `${PKG}dubai4.jpg`,
      `${PKG}dubai6.jpg`,
    ],
    featured: false,
  },
  {
    title: 'Georgia and Armenia',
    slug: 'georgia-and-armenia',
    country: 'Georgia and Armenia',
    destinationSlug: 'georgia-and-armenia',
    duration: '7 Days 6 Nights',
    startingPrice: 899,
    information:
      'Georgia and Armenia, nestled in the breathtaking Caucasus region, offer a captivating blend of history, culture, and natural beauty for tourists to explore. In Georgia, ancient churches and monasteries dot the lush landscapes, while vibrant cities like Tbilisi enchant visitors with their eclectic architecture and lively atmosphere. Indulge in the country\'s rich culinary tradition, savoring hearty khachapuri and aromatic wines amidst stunning mountain scenery. Meanwhile, Armenia boasts a wealth of UNESCO World Heritage sites, including the iconic Geghard Monastery and the ancient rock-hewn churches of Tatev. Wander through the bustling streets of Yerevan, where modern cafes and bustling markets blend seamlessly with centuries-old traditions. Nature lovers can explore the dramatic landscapes of the Armenian Highlands, where rugged mountains and serene lakes offer endless opportunities for adventure. With their warm hospitality and timeless charm, Georgia and Armenia promise unforgettable experiences for tourists seeking to uncover the treasures of the Caucasus.',
    inclusions: STANDARD_INCLUSIONS,
    heroImage: `${PKG}Georgia.jpg`,
    gallery: [`${PKG}arm3.jpg`, `${PKG}arm2.jpg`, `${PKG}geo2.jpg`],
    featured: false,
  },
  {
    title: 'Bangkok and Phuket',
    slug: 'bangkok-and-phuket',
    country: 'Thailand',
    destinationSlug: 'thailand',
    duration: '8 Days 7 Nights',
    startingPrice: 1699,
    information:
      "Bangkok, the vibrant capital of Thailand, entices tourists with its bustling streets, ornate temples, and dynamic street food scene. Explore the majestic Grand Palace, home to Thailand's royal family, and marvel at the intricate beauty of the Wat Pho temple's golden reclining Buddha. Dive into the city's vibrant markets, from the sprawling Chatuchak Weekend Market to the colorful floating markets along the Chao Phraya River, where vendors sell everything from exotic fruits to handmade crafts. Meanwhile, Phuket, Thailand's largest island, beckons with its stunning beaches and vibrant nightlife. Relax on the powdery sands of Patong Beach, indulge in water sports like snorkeling and diving, or explore the island's lush interior with its hidden waterfalls and elephant sanctuaries. Whether immersing in Bangkok's cultural wonders or unwinding on Phuket's tropical shores, Thailand promises an unforgettable adventure for tourists seeking the perfect blend of excitement and relaxation.",
    inclusions: STANDARD_INCLUSIONS,
    heroImage: `${PKG}thailand.jpg`,
    gallery: [
      `${PKG}thailand7.jpg`,
      `${PKG}thailand6.jpg`,
      `${PKG}thailand3.jpg`,
      `${PKG}thailand4.jpg`,
      `${PKG}thailand5.jpg`,
      `${PKG}thailand111.jpg`,
    ],
    featured: false,
  },
  {
    title: 'Bodrum',
    slug: 'bodrum',
    country: 'Turkey',
    destinationSlug: 'turkey',
    duration: '04 Days , 03 Nights',
    startingPrice: 335,
    information:
      "Bodrum's diverse attractions cater to a wide range of travelers, from history buffs and culture enthusiasts to beach-goers and outdoor adventurers. With its stunning natural beauty, rich history, and vibrant local culture, Bodrum is a must-visit destination on the Turkish Riviera.",
    inclusions: [],
    heroImage: `${PKG}inner%20bjv.jpg`,
    gallery: [],
    featured: true,
  },
  {
    title: 'Antalya',
    slug: 'antalya',
    country: 'Turkey',
    destinationSlug: 'turkey',
    duration: '04 Days ,03 Nights',
    startingPrice: 310,
    information:
      'Antalya is a diverse destination that appeals to a wide range of travelers, from history buffs and nature lovers to beach-goers and adventure seekers. With its stunning Mediterranean setting, rich cultural heritage, and abundance of activities, Antalya is a must-visit destination in Turkey.',
    inclusions: [],
    heroImage: `${PKG}antalya-1920.jpg`,
    gallery: [],
    featured: false,
  },
  {
    title: 'Fethiye',
    slug: 'fethiye',
    country: 'Turkey',
    destinationSlug: 'turkey',
    duration: '04 Days 03 Nights',
    startingPrice: 400,
    information:
      "Fethiye's combination of historical significance, natural beauty, and diverse activities make it a versatile and appealing destination for travelers to Turkey. Whether you're interested in exploring ancient ruins, enjoying outdoor adventures, or simply soaking up the local culture, Fethiye has something to offer.",
    inclusions: [],
    heroImage: `${PKG}fethiye4.jpg`,
    gallery: [],
    featured: false,
  },
  {
    title: 'Adana',
    slug: 'adana',
    country: 'Turkey',
    destinationSlug: 'turkey',
    duration: '03 days',
    startingPrice: 245,
    information:
      "Adana offers a diverse range of attractions, from well-preserved historic landmarks to natural wonders and vibrant cultural experiences. Whether you're interested in exploring the city's rich history, enjoying outdoor activities, or indulging in the local cuisine, Adana has something to offer every type of traveler.",
    inclusions: [],
    heroImage: `${PKG}adana.webp`,
    gallery: [],
    featured: true,
  },
]

/** The 3 Cruises, browsed as their own top-level category. */
export const cruiseSeeds: CruiseSeed[] = [
  {
    title: 'MSC Seaside',
    slug: 'msc-seaside',
    country: 'Italy',
    duration: '8 Days 7 Nights',
    startingPrice: 2100,
    information:
      'Embark on a journey of discovery and luxury aboard the MSC Seaside for an incredible 8-day, 7-night cruise through the picturesque landscapes of Italy, Spain, and France. Departing from the charming port cities of Italy, guests will have the opportunity to explore the rich history and cultural treasures of Rome before setting sail towards the vibrant shores of Spain. In Valencia, immerse yourself in the dynamic energy of the city, from its futuristic architecture to its bustling markets. As the cruise continues, guests can soak up the sun on the golden beaches of the French Riviera in Nice or stroll along the iconic Promenade des Anglais. Finally, the voyage returns to Italy, where passengers can indulge in the culinary delights of Sicily or marvel at the stunning coastal vistas of Naples. With luxurious accommodations, gourmet dining options, and exciting excursions, the MSC Seaside offers an unforgettable Mediterranean experience filled with adventure and relaxation.',
    heroImage: `${PKG}MSCSEASIDE.jpg`,
    gallery: [`${PKG}mscseaside2.jpg`, `${PKG}mscseaside1.jpg`],
    featured: false,
  },
  {
    title: 'MSC Divina',
    slug: 'msc-divina',
    country: 'Turkey',
    duration: '9 Days 8 Nights',
    startingPrice: 1780,
    information:
      'Embark on an enchanting voyage aboard the MSC Divina for an immersive 9-day, 8-night journey through the captivating destinations of Izmir, Greece, and Italy. As the ship docks in Izmir, Turkey, travelers can explore its ancient wonders, from the magnificent ruins of Ephesus to the vibrant markets filled with spices and treasures. Then, set sail to the Greek islands, where azure waters and sun-drenched shores await. Explore the iconic beauty of Santorini with its charming villages and breathtaking vistas, or delve into the rich history of Athens, home to the majestic Acropolis and Parthenon. Finally, cruise to Italy, where the MSC Divina unveils the romantic allure of Venice\'s winding canals or the cultural riches of Rome\'s ancient monuments. With luxurious amenities, gourmet dining, and exciting excursions, this 9-day voyage promises an unforgettable experience, blending relaxation, exploration, and the splendor of the Mediterranean.',
    heroImage: `${PKG}MSCDIVINA.jpg`,
    gallery: [
      `${PKG}MSCDIV.jpg`,
      `${PKG}MSCDIV2.jpg`,
      `${PKG}MSCDIV3.jpg`,
      `${PKG}MSCDIV4.jpg`,
    ],
    featured: false,
  },
  {
    title: 'MSC Sinfonia',
    slug: 'msc-sinfonia',
    country: 'Greece',
    duration: '9 Days 8 Nights',
    startingPrice: 1650,
    information:
      'Embark on an unforgettable 9-day, 8-night adventure aboard the magnificent MSC Sinfonia, exploring the stunning beauty of Greece, Croatia, and Italy. Departing from Italy, the cruise sets sail towards the captivating Greek islands, where guests can bask in the Mediterranean sun on the pristine beaches of Mykonos, or wander through the charming streets of Santorini, adorned with iconic blue-domed churches. Next, the journey leads to Croatia, where the ancient city of Dubrovnik awaits, offering a glimpse into its rich history and breathtaking coastal views. As the cruise continues, passengers can savor the flavors of Italy, with stops in Naples and Rome. In Naples, indulge in authentic Neapolitan pizza, while in Rome, marvel at the awe-inspiring architecture of the Colosseum and the grandeur of Vatican City. With luxurious accommodations and exciting excursions, MSC Sinfonia promises an unforgettable Mediterranean experience, filled with culture, history, and breathtaking landscapes.',
    heroImage: `${PKG}MSCSOFINIA.jpeg`,
    gallery: [
      `${PKG}mscsin4.jpg`,
      `${PKG}mscsin3.jpg`,
      `${PKG}mscsinf2.jpg`,
      `${PKG}mscsin%60.jpg`,
    ],
    featured: false,
  },
]

export type TestimonialSeed = {
  quote: string
  authorName: string
  authorLocation?: string
  trip?: string
  rating?: number
  featured: boolean
}

/** A few traveller testimonials for social proof; four are Featured for home. */
export const testimonialSeeds: TestimonialSeed[] = [
  {
    quote:
      'The Maldives trip was flawless from the first WhatsApp message to the flight home. They tailored everything and answered every question — even at midnight.',
    authorName: 'Layla Haddad',
    authorLocation: 'Beirut',
    trip: 'Maldives',
    rating: 5,
    featured: true,
  },
  {
    quote:
      "I hate booking online, so Safar was perfect — a real person planned the whole Istanbul week and just handled the visas. I didn't lift a finger.",
    authorName: 'Karim Nassar',
    authorLocation: 'Tripoli',
    trip: 'Istanbul',
    rating: 5,
    featured: true,
  },
  {
    quote:
      'Our Greek islands honeymoon felt made for us. Fair prices, no pushy upsells, and they were one message away the whole time.',
    authorName: 'Nour Khalil',
    authorLocation: 'Beirut',
    trip: 'Santorini & Mykonos',
    rating: 5,
    featured: true,
  },
  {
    quote:
      "We booked a Mediterranean cruise for the family. Smooth, well-priced, and they sorted the paperwork we'd never have figured out ourselves.",
    authorName: 'Sami Fares',
    authorLocation: 'Saida',
    trip: 'MSC Mediterranean cruise',
    rating: 4,
    featured: true,
  },
  {
    quote:
      'Twenty years of experience really shows. They knew exactly which hotel to pick and got us a better deal than anything I found online.',
    authorName: 'Rana Aoun',
    authorLocation: 'Beirut',
    trip: 'Dubai',
    rating: 5,
    featured: false,
  },
]

/** The single Site Settings record (phones, socials, proof metrics, footer). */
export const siteSettingsSeed: SiteSettingsSeed = {
  mobiles: ['+961 81 800 480', '+961 81 991 992'],
  landline: '+961 21 360 400',
  email: 'info@safartravelandtourism.com',
  address: 'Clemenceau, Beirut, Lebanon',
  whatsapp: '96181800480',
  socials: {
    instagram: 'https://www.instagram.com/safartravelandtourism/',
    facebook: 'https://www.facebook.com/share/15sY19Sd2D/',
  },
  proofMetrics: {
    yearsExperience: 20,
    destinationsCount: 150,
    flightBookings: 600,
    amazingTours: 150,
    happyClients: 700,
    cruisesBookings: 100,
  },
  footerTagline:
    'Explore the World with Us: Creating Memorable Journeys, One Destination at a Time',
}
