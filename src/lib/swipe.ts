/**
 * Horizontal swipe resolution for the touch carousels (rotating gallery,
 * testimonials). Kept as pure logic so the "which way did they swipe?" decision
 * is shared by both components and unit-tested without a browser or pointer.
 */

/** Minimum horizontal travel (px) before a pointer gesture counts as a swipe. */
export const SWIPE_THRESHOLD_PX = 40

/** What a horizontal drag should do to a carousel. */
export type SwipeIntent = 'prev' | 'next' | 'none'

/**
 * Resolve a horizontal drag distance (`dx` = end − start, in px) into a carousel
 * intent. A swipe left (negative `dx`) advances to the *next* slide; a swipe
 * right goes to the *previous*; anything shorter than the threshold is a
 * tap/no-op so accidental nudges don't change the slide.
 */
export function resolveSwipe(dx: number, threshold: number = SWIPE_THRESHOLD_PX): SwipeIntent {
  if (dx <= -threshold) return 'next'
  if (dx >= threshold) return 'prev'
  return 'none'
}
