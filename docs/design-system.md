# Safar design system — "Sea & Sand"

The implemented design system for the Safar rebuild (issue #3), derived from the
[brand brief](brand/brand-brief.md) and [ADR-0004](adr/0004-light-breezy-calm-cinematic-direction.md).
Light-first, breezy, structured; calm-cinematic motion that is "graceful, not
static."

## Tokens

Tokens live as CSS variables in
[`src/app/(frontend)/globals.css`](../src/app/(frontend)/globals.css) and are
surfaced through Tailwind in [`tailwind.config.ts`](../tailwind.config.ts).

### Colour

Two coordinated sets:

- **Named brand utilities** — `bg-cream`, `text-sea`, `text-coral`, `bg-sand`,
  `text-ink`, `bg-sky`, `text-gold`. Direct and expressive.
- **shadcn semantic tokens** — `background`, `foreground`, `card`, `primary`,
  `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring` —
  HSL CSS variables mapped to Sea & Sand so shadcn/ui components are on-brand by
  default.

| Role | Token | Hex |
| --- | --- | --- |
| Background | `cream` | `#FBF7F0` |
| Background alt | `sand` | `#F1E7D6` |
| Ink / text | `ink` | `#12333F` |
| Primary | `sea` | `#0C6E8A` |
| Primary light | `sky` | `#9AD4E4` |
| Accent (CTA) | `coral` | `#F4693B` |
| Accent 2 | `gold` | `#E0A63C` |

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
