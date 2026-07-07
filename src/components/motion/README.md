# Motion primitives

Reusable, `prefers-reduced-motion`-aware building blocks for Safar's
calm-cinematic motion (brand brief §Motion, [ADR-0004](../../../docs/adr/0004-light-breezy-calm-cinematic-direction.md)).
Tooling: **Motion** (`motion/react`) for component interactions, **GSAP +
ScrollTrigger** for scroll scenes, **Lenis** for smooth scrolling.

Import from the barrel:

```tsx
import { RevealOnScroll, HoverLift, KenBurns, Parallax, AnimatedCounter } from '@/components/motion'
```

`SmoothScroll` is already mounted once in `src/app/(frontend)/layout.tsx`; you
do not add it per page.

## Reduced-motion policy — "graceful, not static"

The decision of what to keep vs. ease lives in one place, `src/lib/motion.ts`
(unit-tested in `motion.unit.test.ts`). Normal visitors get full motion. For OS
"reduce motion" visitors we **keep gentle fades** but **ease the large
vestibular movements** — parallax, Ken-Burns zoom, and smooth-scroll — so the
site still breathes instead of snapping to a static page.

| Primitive | Normal | Reduced motion |
| --- | --- | --- |
| `RevealOnScroll` | fade + rise | fade kept, rise → 0 |
| `HoverLift` | lift on hover/focus | kept (intent-driven, not vestibular) |
| `AnimatedCounter` | counts up in view | jumps to final value |
| `Parallax` | drifts with scroll | **still** (factor → 0) |
| `KenBurns` | slow pan/zoom | **still** (animation off) |
| `SmoothScroll` | Lenis momentum | native scroll |

## Catalogue

### `RevealOnScroll`
Fades and rises content in once as it enters the viewport. `delay` staggers
list items.

```tsx
<RevealOnScroll delay={0.05}>…</RevealOnScroll>
```

### `HoverLift`
Softly lifts a floating card on hover/focus. Pair with `shadow-soft` /
`shadow-lift`.

```tsx
<HoverLift className="rounded-2xl shadow-soft hover:shadow-lift">…</HoverLift>
```

### `KenBurns`
Slow cinematic pan/zoom over a hero subject (image, gradient panel, …). Set the
frame height/rounding via `className`.

```tsx
<KenBurns className="h-[70vh] rounded-2xl">
  <div className="h-full w-full bg-[url(...)] bg-cover" />
</KenBurns>
```

### `Parallax`
Light depth drift on scroll via GSAP ScrollTrigger. `factor` ≈ 0.15–0.35.

```tsx
<Parallax factor={0.25}>…</Parallax>
```

### `AnimatedCounter`
Proof-metric counter that counts up when scrolled into view.

```tsx
<AnimatedCounter value={20} suffix="+" /> years
```

### `SmoothScroll`
App-level Lenis provider synced with GSAP ScrollTrigger. Mounted in the
frontend layout; not used directly in pages.
