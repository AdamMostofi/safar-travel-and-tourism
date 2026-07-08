# Safar design system — "Ocean Breeze"

The implemented design system for the Safar rebuild. Motion and structure come
from the original brief (issue #3) and
[ADR-0004](adr/0004-light-breezy-calm-cinematic-direction.md); the colour palette
was refreshed from the warm "Sea & Sand" set to the cool, airy "Ocean Breeze"
palette in design V1.1 (see `docs/design/v1.1-ocean-breeze-redesign.md`).
Light-first, breezy, structured; calm-cinematic motion that is "graceful, not
static."

## Tokens

Tokens live as CSS variables in
[`src/app/(frontend)/globals.css`](../src/app/(frontend)/globals.css) and are
surfaced through Tailwind in [`tailwind.config.ts`](../tailwind.config.ts).

### Colour

Two coordinated sets:

- **Named brand utilities** — `bg-cream`, `text-sea`, `text-pine`, `bg-sand`,
  `text-ink`, `bg-sky`, `bg-mint`. Direct and expressive. (Names are retained
  from Sea & Sand to keep the V1.1 swap low-risk; only the values changed.)
- **shadcn semantic tokens** — `background`, `foreground`, `card`, `primary`,
  `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring` —
  HSL CSS variables mapped to Ocean Breeze so shadcn/ui components are on-brand
  by default.

| Role | Token | Hex |
| --- | --- | --- |
| Background (airy) | `cream` | `#F0F8FF` |
| Background alt (sky band) | `sand` | `#E0F2FE` |
| Ink / text | `ink` | `#243447` |
| Primary (ocean teal) | `sea` | `#0E7490` |
| Primary light (cyan) | `sky` | `#7DD3FC` |
| Accent / CTA (green) | `pine` | `#15803D` |
| Accent 2 (mint) | `mint` | `#D1FAE5` |

### Typography

- **Display / headings:** Fraunces (serif) — `font-display`.
- **Body / UI:** Inter (sans) — `font-body`.

Both are loaded via `next/font/google` in the frontend layout and exposed as
`--font-display` / `--font-body`. `h1–h4` default to the display face; `body`
defaults to the body face.

### Spacing, radius, elevation

- Section rhythm: `py-section` (4rem), `py-section-lg` (7rem); page width
  `max-w-content` (72rem), centered `container`.
- Radius scales off `--radius` (0.75rem): `rounded-sm/md/lg/2xl`.
- Elevation: `shadow-soft` (resting cards) and `shadow-lift` (raised/hover).

## Motion

Reusable primitives live in
[`src/components/motion/`](../src/components/motion/README.md) — `RevealOnScroll`,
`HoverLift`, `KenBurns`, `Parallax`, `AnimatedCounter`, and the app-level
`SmoothScroll` (Lenis + GSAP ScrollTrigger). Motion (`motion/react`) drives
component interactions; GSAP + Lenis drive scroll/hero choreography.

### Reduced-motion policy — "graceful, not static"

Encoded once as pure, unit-tested logic in
[`src/lib/motion.ts`](../src/lib/motion.ts) (`motion.unit.test.ts`). Normal
visitors get full motion. Visitors who set OS "reduce motion" keep the gentle
fades but have the large **vestibular** movements eased out: parallax and
Ken-Burns zoom stop, smooth scroll falls back to native, and reveal travel
collapses to a pure fade. The site keeps breathing — it never snaps to a static
page. See the primitive README for the per-primitive table.
