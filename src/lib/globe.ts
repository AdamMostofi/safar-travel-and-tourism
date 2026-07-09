/**
 * Enable/disable policy for the interactive canvas globe in the home hero
 * (issue #26).
 *
 * The live globe is a Canvas 2D + d3-geo enhancement that auto-rotates and
 * redraws thousands of land dots every frame — genuinely desktop-first. It steps
 * aside for a static hero (the destination photo / CSS globe) whenever the live
 * canvas would be a poor trade:
 *   - Coarse pointers (touch): there is no hovering pointer to drag-rotate with,
 *     and the per-frame redraw is costly on the phones that carry them.
 *   - Low device concurrency: few logical cores means the animation loop starves
 *     the main thread and jank shows through.
 *   - Reduced motion: the continuous auto-rotation is exactly the ambient
 *     movement "reduce motion" asks us to drop (ADR-0004, "graceful, not
 *     static" — the fallback is a calm, still hero, not a frozen canvas).
 *
 * Kept as pure functions so the gating decision is unit-testable without a
 * browser; the component reads the live values (`matchMedia`,
 * `navigator.hardwareConcurrency`) and defers to these.
 */

/**
 * At or below this many logical cores we treat the device as too constrained to
 * run the live globe smoothly and serve the static fallback instead.
 */
export const MAX_LOW_POWER_CORES = 4

export type GlobeEnvironment = {
  /** `(pointer: coarse)` matches — touch or other imprecise pointer. */
  coarsePointer: boolean
  /** `(prefers-reduced-motion: reduce)` matches. */
  reducedMotion: boolean
  /**
   * `navigator.hardwareConcurrency`, or `undefined` when the browser withholds
   * it. Unknown is treated as capable — we only gate on a *known-low* count.
   */
  hardwareConcurrency: number | undefined
}

/** Whether a (possibly unknown) core count is low enough to force the fallback. */
export function isLowConcurrency(hardwareConcurrency: number | undefined): boolean {
  return typeof hardwareConcurrency === 'number' && hardwareConcurrency <= MAX_LOW_POWER_CORES
}

/**
 * Whether the live canvas globe should run. Only fine-pointer, non-reduced-motion
 * visitors on a device with enough cores get it; everyone else gets the static
 * hero fallback.
 */
export function shouldRenderLiveGlobe({
  coarsePointer,
  reducedMotion,
  hardwareConcurrency,
}: GlobeEnvironment): boolean {
  return !coarsePointer && !reducedMotion && !isLowConcurrency(hardwareConcurrency)
}
