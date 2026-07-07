/**
 * Motion policy for the Safar design system.
 *
 * The brand direction is "graceful, not static" (brand brief §Motion,
 * ADR-0004): normal visitors get full calm-cinematic motion; visitors who set
 * the OS "reduce motion" preference keep the gentle fades but have the large
 * *vestibular* movements — parallax, Ken-Burns pan/zoom, scroll-pinning — eased
 * out. The site still breathes; it never freezes.
 *
 * These are pure functions so every motion primitive resolves the same policy
 * and it can be unit-tested without a browser. The live OS preference is read
 * by the primitives themselves via `useReducedMotion` from `motion/react`.
 */

/** Every distinct kind of motion the design system ships. */
export const MOTION_KINDS = [
  'fade',
  'rise',
  'hover-lift',
  'counter',
  'parallax',
  'ken-burns',
  'scroll-pin',
] as const

export type MotionKind = (typeof MOTION_KINDS)[number]

/**
 * The large vestibular movements that trigger motion sickness. Under reduced
 * motion these are the ones we ease out; everything else stays (gently) alive.
 */
const VESTIBULAR: ReadonlySet<MotionKind> = new Set([
  'parallax',
  'ken-burns',
  'scroll-pin',
])

/** Whether a motion kind is eased out when the visitor prefers reduced motion. */
export function isSuppressedUnderReducedMotion(kind: MotionKind): boolean {
  return VESTIBULAR.has(kind)
}

/** Default distance (px) a reveal-on-scroll element rises from below. */
export const REVEAL_OFFSET_PX = 24

/**
 * How far a reveal element travels. The fade is always kept (handled by the
 * primitive's opacity); reduced motion only eases the *travel* to zero.
 */
export function revealOffset(reducedMotion: boolean): number {
  return reducedMotion ? 0 : REVEAL_OFFSET_PX
}

/**
 * Effective parallax factor: layers move at `factor`× scroll normally, and not
 * at all under reduced motion (parallax is vestibular).
 */
export function parallaxFactor(factor: number, reducedMotion: boolean): number {
  return reducedMotion ? 0 : factor
}

/** Whether the Ken-Burns pan/zoom drift should run (off under reduced motion). */
export function kenBurnsEnabled(reducedMotion: boolean): boolean {
  return !reducedMotion
}
