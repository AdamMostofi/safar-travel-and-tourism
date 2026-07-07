# PRD: Safar Travel & Tourism — Website Rebuild

> Source decisions: [CONTEXT.md](../../CONTEXT.md), [ADR-0001..0004](../adr/), [brand brief](../brand/brand-brief.md). Real source content: `content/crawl/`.

## Problem Statement

Safar is a trusted, 20-year Beirut travel agency, but its current website is a generic dark template that looks like every other agency, buries the brand, and does little to turn visitors into enquiries. Prospective travellers can't feel the warm, "fresh & breezy," trustworthy character that defines Safar in person, and the agency depends on a previous vendor's backend it doesn't fully control. Safar wants a new, uniquely-branded site that feels alive and premium-yet-approachable, showcases its real trips, and reliably captures leads — while letting staff manage content themselves.

## Solution

A rebuilt, light-and-breezy "Sea & Sand" website with calm-cinematic motion (an image-based Ken-Burns hero, gentle scroll reveals, parallax, floating cards, smooth scrolling) that stays fast and uncluttered. It presents Safar's real Packages, Destinations, and Cruises from the crawled content, and converts visitors through an enquiry-led flow — prefilled WhatsApp/call CTAs and a "Request this trip" form that saves a Lead and notifies staff. Content lives in Payload CMS on Safar's own Postgres, so staff add/edit trips and prices without a developer. English at launch, modeled so Arabic/RTL can follow.

## User Stories

### Visitor — discovery & browsing
1. As a prospective traveller, I want an inviting, cinematic home page, so that I immediately feel Safar's premium-yet-welcoming character.
2. As a visitor, I want to see Featured "Popular Tours" and "Top Destinations" on the home page, so that I can quickly find Safar's best offers.
3. As a visitor, I want to see Safar's proof metrics (20 years, 150+ destinations, happy clients, bookings), so that I trust the agency.
4. As a visitor, I want to browse all Packages in a clean grid, so that I can scan options by destination, duration, and Starting Price.
5. As a visitor, I want to filter/group Packages by Destination, so that I can find trips to places I care about.
6. As a visitor, I want a dedicated page per Destination listing its Packages, so that I can plan around a place.
7. As a visitor, I want to open a Package detail page, so that I can read the description, Starting Price, duration, country, Inclusions, and photo gallery.
8. As a visitor, I want to browse Cruises separately and open a Cruise detail page, so that I can consider a sailing holiday.
9. As a visitor, I want an About page conveying Safar's story, services, and mission, so that I understand who I'd be travelling with.
10. As a visitor, I want a Contact page with phones, email, address, WhatsApp, and socials, so that I can reach Safar my preferred way.

### Visitor — motion & experience
11. As a visitor, I want a serene, slowly-drifting hero image with graceful text reveals, so that the site feels like a calm holiday from the first second.
12. As a visitor, I want sections to glide and fade in as I scroll, so that the page always feels alive but never frantic.
13. As a visitor, I want cards to lift softly on hover and buttons to respond to my cursor, so that the site feels crafted and responsive.
14. As a visitor, I want animated counters on the proof metrics, so that the numbers feel dynamic.
15. As a visitor on a phone, I want the motion to stay smooth and the layout to stay fast and readable, so that the experience is good on mobile.
16. As a visitor who prefers reduced motion, I want animations to gracefully reduce, so that the site respects my accessibility setting.

### Visitor — conversion (enquiry)
17. As an interested visitor, I want a prominent "Request this trip" CTA on every Package and Cruise, so that I can act the moment I'm interested.
18. As a visitor, I want the enquiry form prefilled with the Package I'm viewing, so that I don't have to describe it.
19. As a visitor, I want to submit an Enquiry with my name, contact, preferred dates, and party size, so that Safar can follow up with details.
20. As a visitor, I want clear validation and a confirmation after submitting, so that I know my Enquiry was received.
21. As a visitor, I want a one-tap WhatsApp option prefilled with the trip, so that I can chat instantly instead of filling a form.
22. As a visitor, I want click-to-call phone links, so that I can call Safar directly from my phone.

### Staff / editor (Payload CMS)
23. As a staff editor, I want to log into a friendly admin dashboard, so that I can manage the site without a developer.
24. As a staff editor, I want to create/edit/delete Packages (title, destination, duration, Starting Price, description, Inclusions, gallery, Featured flag), so that I keep offers current.
25. As a staff editor, I want to manage Destinations and associate Packages, so that browsing stays organised.
26. As a staff editor, I want to manage Cruises like Packages, so that sailing offers stay current.
27. As a staff editor, I want to mark items as Featured, so that I control the home-page highlights.
28. As a staff editor, I want to upload and manage images in a media library, so that trips look great.
29. As a staff editor, I want to edit global site settings (phones, email, address, socials, proof metrics), so that contact details stay accurate everywhere.
30. As a staff member, I want to see submitted Leads in the admin, so that I can follow up and close deals.
31. As a staff member, I want an email notification when a Lead arrives, so that I respond quickly.

### SEO, performance, accessibility, trust
32. As the business owner, I want each page to have proper titles, meta descriptions, canonical links, and OpenGraph tags, so that Safar ranks and shares well.
33. As the business owner, I want a sitemap and clean, human-readable URLs (by slug), so that search engines index the site.
34. As a visitor using assistive tech, I want proper landmarks, labelled form fields, alt text, correct heading order, and named links/buttons, so that the site is accessible (fixing issues the current site fails).
35. As a visitor, I want the site to load fast and score well on Core Web Vitals, so that browsing is pleasant.
36. As the business owner, I want the site to look intentional and branded (refreshed wordmark + signature mark, consistent Sea & Sand system), so that Safar stands out from template competitors.

### Content migration
37. As the business owner, I want all ~25 real Packages, Destinations, and 3 Cruises seeded from the existing content, so that the new site launches complete and accurate — not with dummy content.

## Implementation Decisions

- **Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui for components; **Motion** for component interactions and **GSAP (+ScrollTrigger) + Lenis** for the hero and scroll choreography. Per [ADR-0004](../adr/0004-light-breezy-calm-cinematic-direction.md).
- **CMS & data:** **Payload CMS** embedded in the Next.js app, backed by **Postgres**, per [ADR-0001](../adr/0001-payload-cms-with-postgres.md). Payload's local API is used server-side for content queries.
- **Content model (Payload collections & globals):**
  - `Package` — title, slug, destination (relationship), country, duration, startingPrice, information (rich text), inclusions (list), gallery (media[]), heroImage, featured (bool).
  - `Destination` — name, slug, heroImage, packages (reverse relationship), featured (bool).
  - `Cruise` — title, slug, country, duration, startingPrice, information, gallery, heroImage, featured (bool).
  - `Lead` — name, email, phone, packageRef (optional relationship/label), preferredDates, partySize, message, source (form/whatsapp), createdAt, status.
  - `Media` — uploads with alt text.
  - `SiteSettings` (global) — phones, landline, email, address, WhatsApp number, social links, proof metrics (years, destinations, happyClients, flightBookings, cruiseBookings), footer tagline.
  - Fields modeled so a locale dimension can be added later without restructuring, per [ADR-0003](../adr/0003-english-only-launch-i18n-ready.md).
- **Server data/actions layer (primary test seam):** a thin server module between Payload and the pages exposing UI-ready view models and the enquiry action — e.g. `listPackages`, `getPackageBySlug`, `listDestinations`, `getDestinationBySlug`, `listCruises`, `getCruiseBySlug`, `listFeaturedPackages`, `listFeaturedDestinations`, `getSiteSettings`, and `submitEnquiry(input)`. Pages consume only this layer; they hold no data logic.
- **Enquiry flow:** `submitEnquiry` validates input (schema validation), creates a `Lead` in Payload, and sends a staff notification email via a provider (e.g. Resend or SMTP — provider is an open item), returning a typed success/error result. A WhatsApp deep-link (prefilled with the `Package` and Starting Price) is offered as an alternative path. No payment, per [ADR-0002](../adr/0002-enquiry-led-no-online-payment.md).
- **Routing:** `/`, `/destinations`, `/destinations/[slug]`, `/packages`, `/packages/[slug]`, `/cruises`, `/cruises/[slug]`, `/about`, `/contact`. Slugs come from the CMS.
- **Design system:** tokens from the [brand brief](../brand/brand-brief.md) — Sea & Sand palette (cream/sand, sea/sky blue, coral accent), Fraunces (display) + Inter/Geist (body), and reusable motion primitives (reveal-on-scroll, parallax, hover-lift, Ken-Burns, animated counter) that all honour `prefers-reduced-motion`.
- **Media:** reuse existing destination photos (imported into Payload `Media` from the current `bo.safartravelandtourism.com` URLs during seeding); image-only Ken-Burns hero — no video at launch.
- **Logo:** refreshed "Safar" wordmark (light-theme ink/teal) plus a signature mark (sun/wave/compass/journey-path direction) delivered as a design task with options; light and dark variants + favicon.
- **Content seeding:** a repeatable seed routine imports the crawled Packages (25), Destinations, and Cruises (3) from `content/crawl/` into Payload, so launch content is real.
- **SEO/a11y baseline:** per-page metadata, canonical, OpenGraph, sitemap; and fix the accessibility gaps the crawl flagged on the old site — clickable phone numbers, labelled form fields, a `main` landmark, correct heading levels, and aria-labels on icon-only controls.
- **Deployment (proposed, open):** Vercel for the app; managed Postgres (Neon/Railway/Vercel Postgres).

## Testing Decisions

- **What makes a good test:** assert *external behavior* through the server data/actions seam, not implementation details. Tests exercise the public functions and observe results (a `Lead` row exists; a query returns the right shaped/filtered view models), never internal wiring.
- **Primary seam — server data/actions layer (integration tests against a test Postgres via Payload's local API):**
  - Content queries: given seeded content, `listPackages`/`getPackageBySlug`/`listDestinations`/`getDestinationBySlug`/`listCruises`/`getCruiseBySlug`/`listFeatured…` return correctly shaped, filtered, and slug-resolved data; missing slugs behave as not-found.
  - `submitEnquiry`: a valid Enquiry creates a `Lead` with the captured fields and triggers the staff notification; invalid input is rejected with typed errors; the viewed `Package` context is recorded.
- **Secondary — Playwright smoke (E2E):** critical pages (home, a Package detail, a Cruise detail, contact) render from seeded data; the enquiry form happy-path submits and shows confirmation; the WhatsApp CTA builds a correct prefilled link.
- **Prior art:** none yet (greenfield) — this PRD establishes the seam and testing pattern that later work follows.

## Out of Scope

- Online booking, checkout, availability, and any payment gateway (see [ADR-0002](../adr/0002-enquiry-led-no-online-payment.md)).
- Arabic language and RTL layout at launch (modeled for later, see [ADR-0003](../adr/0003-english-only-launch-i18n-ready.md)).
- Real customer testimonials / reviews section (until Safar supplies content) and a "Why Safar" trust block beyond existing copy.
- Video hero / bespoke footage (image-only Ken-Burns at launch).
- Blog / travel guides, customer accounts/login, loyalty, multi-currency, and any integration with the old `bo.safartravelandtourism.com` backend.

## Further Notes

- **Open items to resolve during build:** email/notification provider (Resend vs SMTP); managed Postgres + hosting choice; confirmation of rights to reuse the existing destination photos; whether/when Safar provides testimonials and real footage; optional analytics (e.g. GA4).
- **Source content:** all real copy, prices, durations, Inclusions, and image URLs are in `content/crawl/` (per-page markdown + `safar-all.md`).
- **Brand tension recorded:** motion is deliberately *calm-cinematic*, not avant-garde, to fit the grounded/breezy brand ([ADR-0004](../adr/0004-light-breezy-calm-cinematic-direction.md)).
- This PRD is intentionally the whole product; `/to-issues` will slice it into independently-grabbable issues (e.g. project scaffold, design system, CMS + model, seed, each page group, enquiry flow, SEO/a11y, logo).
