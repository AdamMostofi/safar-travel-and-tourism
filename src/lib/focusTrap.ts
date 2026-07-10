/**
 * Keyboard focus-trap math for the site assistant panel (issue #30).
 *
 * While the panel is open it behaves like a dialog: Tab and Shift+Tab must
 * cycle within its focusable elements rather than escaping to the page behind
 * it. The component queries the live focusable elements and the active one from
 * the DOM; this pure helper decides where focus should land when a Tab press
 * would otherwise leave the trap, so the wrap logic is unit-testable without a
 * browser.
 */

export type TrapTabArgs = {
  /** How many focusable elements the trap currently contains. */
  count: number
  /** Index of the focused element within the trap, or -1 if focus is elsewhere. */
  currentIndex: number
  /** Whether Shift was held (reverse tab order). */
  shiftKey: boolean
}

/**
 * The index to move focus to when a Tab would otherwise leave the trap, or
 * `null` to let the browser handle the move normally (focus stays inside).
 *
 * Forward tabbing off the last element wraps to the first; backward tabbing off
 * the first wraps to the last. Focus that has strayed outside the trap
 * (`currentIndex < 0`) is pulled to the first element on Tab and the last on
 * Shift+Tab. With no focusable elements there is nothing to do.
 */
export function trapTabIndex({ count, currentIndex, shiftKey }: TrapTabArgs): number | null {
  if (count <= 0) return null

  const last = count - 1

  // Focus is not inside the trap yet — pull it to the appropriate edge.
  if (currentIndex < 0) return shiftKey ? last : 0

  if (shiftKey) {
    return currentIndex === 0 ? last : null
  }
  return currentIndex === last ? 0 : null
}
