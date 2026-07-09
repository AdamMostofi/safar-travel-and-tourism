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

/**
 * Destination-waypoint geometry for the globe hero (issue #28). Kept here as
 * pure functions — no canvas, no d3 — so both the front-hemisphere culling and
 * the click hit-testing are unit-testable without a browser. The component feeds
 * them the live `projection.rotate` value and the markers' projected screen
 * positions.
 */

/** A `[longitude, latitude]` pair in degrees (as passed to `projection.rotate`). */
export type LngLat = [number, number]

/**
 * Whether a geographic point faces the visible (near) hemisphere of an
 * orthographic globe rotated by `rotation` (d3's `[λ, φ]` rotate, in degrees).
 *
 * This matters because d3's `projection([lng, lat])` still returns screen
 * coordinates for back-side points — they fold onto the same disc — so a
 * destination on the far side would otherwise draw (and be clickable) straight
 * through the globe. The screen centre shows the geographic point
 * `[-λ, -φ]`; a point is on the near hemisphere when its angular distance from
 * that centre is under 90°.
 */
export function isFacingFront(point: LngLat, rotation: LngLat): boolean {
  const toRad = Math.PI / 180
  const [lng, lat] = point
  const [rotLng, rotLat] = rotation
  const centreLat = -rotLat * toRad
  const deltaLng = (lng + rotLng) * toRad
  const pointLat = lat * toRad
  const cosDistance =
    Math.sin(centreLat) * Math.sin(pointLat) +
    Math.cos(centreLat) * Math.cos(pointLat) * Math.cos(deltaLng)
  return cosDistance > 0
}

/** A drawn marker's current screen position, tagged with its destination slug. */
export type MarkerHit = { slug: string; x: number; y: number }

/**
 * The marker whose drawn disc (`radius` px) contains the point `(px, py)`, or
 * `null` when the click missed every marker. The canvas exposes no DOM targets,
 * so clicks are resolved against the markers' last projected positions. When
 * markers overlap, the last one in the list (drawn on top) wins.
 */
export function findMarkerAt(
  px: number,
  py: number,
  markers: ReadonlyArray<MarkerHit>,
  radius: number,
): MarkerHit | null {
  let hit: MarkerHit | null = null
  for (const marker of markers) {
    const dx = px - marker.x
    const dy = py - marker.y
    if (dx * dx + dy * dy <= radius * radius) hit = marker
  }
  return hit
}
