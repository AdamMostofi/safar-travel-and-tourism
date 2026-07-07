# Safar Travel & Tourism — Website

Rebuild of the Safar Travel & Tourism website. See the [PRD](docs/prd/0001-safar-website-rebuild.md),
[CONTEXT.md](CONTEXT.md) glossary, and [ADRs](docs/adr/) for the product and
architecture decisions.

This repo currently contains the **tracer skeleton** (issue #2): a thin but
complete slice through schema → data layer → UI → tests that the rest of the
build extends.

## Stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS** + **shadcn/ui**
  (`components.json`, `src/components/ui/`, `cn()` in `src/lib/utils.ts`)
- **Payload CMS** embedded in the Next app, backed by **Postgres**
  ([ADR-0001](docs/adr/0001-payload-cms-with-postgres.md))
- **Vitest** integration tests + **Playwright** smoke tests

## Architecture

- `src/payload.config.ts` — Payload config (Postgres adapter, collections).
- `src/collections/` — Payload collections. Tracer slice ships `Packages` and
  the admin `Users` collection.
- `src/server/` — the **server data/actions layer**, the primary test seam.
  Pages consume only these UI-ready view models (`listPackages`,
  `getPackageBySlug`) and never touch Payload directly.
- `src/app/(frontend)/` — public pages (`/`, `/packages`, `/packages/[slug]`).
- `src/app/(payload)/` — the Payload admin panel and REST/GraphQL routes.
- `src/seed/` — idempotent content seeding from `content/crawl/`.
- `src/migrations/` — Payload database migrations (the schema source of truth;
  live dev-push is disabled). Regenerate with `npm run migrate:create` after
  changing collections, apply with `npm run migrate`.

## Prerequisites

- Node.js ≥ 20.9
- A Postgres database. Either:
  - **Docker** — `npm run db:up` uses `docker-compose.yml` (also creates the
    `safar_test` database), or
  - **No Docker** — `npm run db:dev` starts a bundled Postgres in `.dev-postgres/`
    using the same binary the tests use.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env        # then edit if needed

# 3. Start Postgres  (Docker:)
npm run db:up
#                    (or, without Docker, in a separate terminal:)
npm run db:dev

# 4. Apply migrations and seed the two tracer Packages
#    (`npm run seed` applies migrations first, so this is one step)
npm run seed

# 5. Run the app
npm run dev
```

- Front-end: <http://localhost:3000> → **Browse Packages** → detail pages.
- Payload admin: <http://localhost:3000/admin> (create the first admin user on
  first visit).

## Content management (Payload admin)

Log in at `/admin` to create, edit, and delete Packages. Staff manage content
here without a developer — the front-end reads whatever the CMS holds.

## Testing

```bash
npm run test         # Vitest integration tests (server data layer)
```

Integration tests are self-contained: `test/global-setup.ts` boots a throwaway
embedded Postgres, and each run applies migrations and seeds fixed content
before asserting the data layer's behaviour. No Docker or running Postgres is
needed. (To run against an external Postgres instead, set `DATABASE_URI_TEST`
and drop the `globalSetup` in `vitest.config.ts`.)

```bash
npx playwright install chromium   # once, to fetch the browser
npm run test:e2e     # Playwright smoke — seeds the dev DB, boots the app, drives the UI
```

The Playwright smoke uses the **dev** database, so start Postgres
(`npm run db:up` or `npm run db:dev`) first.

## Useful scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js app (front-end + Payload admin) |
| `npm run build` / `npm run start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run generate:types` | Regenerate `src/payload-types.ts` from the config |
| `npm run seed` | Apply migrations, then idempotently seed the tracer Packages |
| `npm run migrate` / `npm run migrate:create` | Apply / generate database migrations |
| `npm run db:up` / `npm run db:down` | Start / stop the Postgres container (Docker) |
| `npm run db:dev` | Start a bundled Postgres without Docker (`.dev-postgres/`) |
| `npm run test` | Vitest integration tests |
| `npm run test:e2e` | Playwright smoke |
