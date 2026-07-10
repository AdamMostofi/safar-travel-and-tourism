/**
 * The site assistant launcher's one-time attention nudge (issue #35).
 *
 * After a spell of inactivity the launcher does a brief "peek/wave" to draw the
 * eye. This pure gate decides whether that nudge is allowed to fire at a given
 * moment; the component owns the inactivity timer and the once-per-session flag
 * and calls this to decide. Kept pure so the "never while open / at most once /
 * off under reduced motion" policy is unit-tested without timers or a DOM.
 */

export type NudgeState = {
  /** Whether the panel is currently open. */
  open: boolean
  /** Whether the nudge has already fired this session. */
  alreadyNudged: boolean
  /** Whether the visitor prefers reduced motion. */
  reducedMotion: boolean
}

/** Whether the attention nudge may fire right now. */
export function shouldNudge({ open, alreadyNudged, reducedMotion }: NudgeState): boolean {
  return !open && !alreadyNudged && !reducedMotion
}
