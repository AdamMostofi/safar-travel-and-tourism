# Safar — Brand Brief

The working spec for Safar's visual, motion, and voice system. Decisions here are recorded in [ADR-0004](../adr/0004-light-breezy-calm-cinematic-direction.md). Colours and type below are **starting proposals** to be validated with a rendered sample, not final tokens.

## Positioning

**The Reliable Guide.** A trusted, full-service Beirut travel agency of 20 years that makes global travel feel accessible — from budget regional trips to premium long-haul escapes. *"Safar" (سفر) means "journey" in Arabic.*

## Personality

- **Welcoming & enthusiastic** — warm, aspirational, inviting.
- **Direct & dependable** — grounded, reassuring, competent. Not avant-garde, not hyper-trendy.
- **Attentive** — personal service, human connection, easy to reach.

## Overall feel

- **Aspirational yet accessible** — premium-getaway imagery over an approachable layout.
- **Fresh & breezy** — light backgrounds, generous whitespace, calm and uncluttered; the carefree feeling of being on holiday.
- **Structured & trustworthy** — clean grid, upfront proof metrics, organised and safe.

## Colour — "Sea & Sand" (proposal)

Light-first. Cream/sand canvas, sea & sky blues as the core, a warm coral/sunset accent for energy and CTAs.

| Role | Name | Hex (proposed) |
|------|------|----------------|
| Background | Cream | `#FBF7F0` |
| Background alt | Warm Sand | `#F1E7D6` |
| Ink / text | Deep Sea | `#12333F` |
| Primary | Sea Blue | `#0C6E8A` |
| Primary light | Sky Blue | `#9AD4E4` |
| Accent (CTA) | Coral Sunset | `#F4693B` |
| Accent 2 (optional) | Warm Gold | `#E0A63C` |

Usage: cream/sand fields with lots of air; sea-blue for structure and links; coral reserved for primary CTAs and key highlights so it stays energetic, not noisy.

## Typography (proposal)

- **Display / headings:** an editorial, slightly soft serif for wanderlust and warmth — e.g. **Fraunces** (or DM Serif Display / Playfair as alternates).
- **Body / UI:** a clean, modern sans — e.g. **Inter** / **Geist** / **General Sans**.
- **Future Arabic:** pair with an Arabic face (e.g. IBM Plex Sans Arabic) when localization lands — see [ADR-0003](../adr/0003-english-only-launch-i18n-ready.md).

## Motion — calm-cinematic & breezy

Constant motion, but unhurried and graceful. "Never a dull moment" without ever feeling frantic or avant-garde.

- **Hero:** image-only **Ken-Burns** — slow drifting pan/zoom across a stunning high-res destination photo, with graceful staggered text reveals and subtle parallax layers. No video for launch.
- **Scroll:** smooth momentum scrolling (**Lenis**); sections glide/fade + rise in gently as they enter.
- **Depth:** light parallax on imagery; floating cards that lift softly on hover.
- **Delight:** animated proof-metric counters, magnetic/soft-press primary buttons, silky page/section transitions.
- **Choreography tooling:** **GSAP** (+ScrollTrigger) for the hero and scroll scenes; **Motion** for component-level interactions.
- **Guardrails — graceful, not static:** full motion for all normal visitors. For visitors who set OS *reduce motion*, keep gentle fades but ease only the large vestibular movements (heavy parallax, zoom, scroll-pinning) — the site still animates, never goes static. Keep 60fps and light on mobile; motion must serve content, never delay access to prices or CTAs.

## Logo

Refresh the existing **"Safar" wordmark** for the light theme (Deep Sea / Sea Blue ink) and add a small **signature mark** for favicon/app/social. Motif directions to explore: rising sun, wave, compass, or a stylised journey path / "S". Deliver light- and dark-background versions. Treated as its own design task with a few options to choose from.

## Voice

- Warm, confident, personal. Speak as experienced hosts: *"Your journey, crafted by people who've done this for 20 years."*
- Concrete and reassuring — lead with real destinations, durations, starting prices, and inclusions.
- Always an easy next step: enquire, WhatsApp, or call. See [ADR-0002](../adr/0002-enquiry-led-no-online-payment.md).
