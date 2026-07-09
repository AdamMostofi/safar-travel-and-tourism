/**
 * Enable/disable policy for the desktop "waypoint" custom cursor (issue #25).
 *
 * The cursor is a fine-pointer, desktop-only flourish. It must switch itself
 * off — restoring the native cursor — whenever it would be inappropriate or
 * unwelcome:
 *   - Coarse pointers (touch / stylus): there is no hovering pointer to follow,
 *     so a trailing marker is meaningless and would fight real taps.
 *   - Reduced motion: the marker lerps/rotates continuously, which is exactly
 *     the kind of ambient movement "reduce motion" asks us to drop.
 *
 * Kept as a pure function so the gating decision is unit-testable without a
 * browser; the live media-query state is read by the component via `matchMedia`.
 */

export type CursorEnvironment = {
  /** `(pointer: coarse)` matches — touch or other imprecise pointer. */
  coarsePointer: boolean
  /** `(prefers-reduced-motion: reduce)` matches. */
  reducedMotion: boolean
}

/**
 * Whether the custom waypoint cursor should run. Only fine-pointer visitors who
 * have not asked to reduce motion get it; everyone else keeps the native cursor.
 */
export function shouldEnableCursor({ coarsePointer, reducedMotion }: CursorEnvironment): boolean {
  return !coarsePointer && !reducedMotion
}
