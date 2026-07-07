# Visual direction: light & breezy with calm-cinematic motion

**Decision:** The site uses a light, airy "Sea & Sand" visual system with constant but calm, unhurried motion — a Ken-Burns image-based cinematic hero, gentle scroll reveals, parallax, floating cards, and smooth (Lenis) scrolling. Not a dark template, not an avant-garde scroll-hijacked showreel. Full spec in [docs/brand/brand-brief.md](../brand/brand-brief.md).

**Why:** Safar's brand is *The Reliable Guide* — welcoming, dependable, aspirational-yet-accessible, "fresh & breezy," structured & trustworthy, explicitly **not** hyper-trendy. A light, spacious system expresses the carefree-holiday feeling while staying credible; calm motion keeps the page alive ("never a dull moment") without fighting the grounded, uncluttered brand. This deliberately tempers the earlier "cinematic" impulse to match the brand.

## Considered Options

- **Dark luxury / bold-adventurous / minimal** — rejected as the lead: each pulls away from the warm, accessible, breezy positioning.
- **Full cinematic scroll-hijack with video hero** — rejected: too avant-garde for the brand, heavier on performance/mobile, and video assets don't exist. Image-only Ken-Burns hero chosen instead.

## Consequences

- Tech: Next.js + TypeScript + Tailwind + shadcn/ui + Motion, with GSAP + Lenis for the hero/scroll choreography.
- All motion must respect `prefers-reduced-motion` and stay performant on mobile.
