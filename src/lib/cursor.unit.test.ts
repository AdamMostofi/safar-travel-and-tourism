import { describe, expect, it } from 'vitest'

import { shouldEnableCursor } from './cursor'

/**
 * The waypoint cursor (issue #25) is a desktop, fine-pointer flourish. It must
 * gate itself off for coarse (touch) pointers and for visitors who prefer
 * reduced motion, restoring the native cursor. This pure decision encodes that
 * so the gating can be asserted without a browser.
 */
describe('shouldEnableCursor', () => {
  it('enables only for a fine pointer with motion allowed', () => {
    expect(shouldEnableCursor({ coarsePointer: false, reducedMotion: false })).toBe(true)
  })

  it('disables on coarse (touch) pointers so real taps are never disturbed', () => {
    expect(shouldEnableCursor({ coarsePointer: true, reducedMotion: false })).toBe(false)
  })

  it('disables under reduced motion (no ambient lerp/rotate)', () => {
    expect(shouldEnableCursor({ coarsePointer: false, reducedMotion: true })).toBe(false)
  })

  it('stays disabled when both conditions apply', () => {
    expect(shouldEnableCursor({ coarsePointer: true, reducedMotion: true })).toBe(false)
  })
})
