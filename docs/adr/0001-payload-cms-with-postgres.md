# Content runs on Payload CMS with self-owned Postgres, inside the Next.js app

**Decision:** Content (Packages, Destinations, Cruises, Leads) is managed in Payload CMS running inside the Next.js application, backed by our own Postgres database. Real content from the old site is seeded in.

**Why:** Staff must add/edit packages and prices without a developer, and Safar wants to own its data outright rather than depend on the previous vendor's backend (`bo.safartravelandtourism.com`, "Safar By Forth"). Payload gives an admin dashboard, unlimited editors with no per-seat fees, and keeps content + images in a database we control — all in a single repo and deploy.

## Considered Options

- **Reuse the existing `bo.safartravelandtourism.com` backend** — rejected: ties us to the old vendor, likely no clean API, unknown reliability, and constrains the redesign.
- **Seeded static content (TS/JSON/MDX)** — rejected as the primary model: fastest and free, but every content change needs a developer + redeploy, which doesn't fit a business that changes seasonal offers.
- **Sanity (hosted cloud)** — rejected: excellent DX and image handling, but content lives on a third-party cloud; Safar explicitly preferred self-owned data.

## Consequences

- We host a Postgres database (managed options like Neon/Railway/Vercel Postgres are cheap).
- The content model must be designed as the source of truth; the crawled markdown under `content/crawl/` is the seed, not the runtime source.
