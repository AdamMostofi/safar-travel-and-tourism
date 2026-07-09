import { describe, expect, it } from 'vitest'

import { SWIPE_THRESHOLD_PX, resolveSwipe } from './swipe'

/**
 * The touch carousels resolve a horizontal drag into a slide change. A swipe
 * left advances (next); a swipe right goes back (prev); short gestures are
 * treated as taps so a stray finger nudge never skips a slide.
 */
describe('resolveSwipe', () => {
  it('advances to the next slide on a clear left swipe', () => {
    expect(resolveSwipe(-SWIPE_THRESHOLD_PX)).toBe('next')
    expect(resolveSwipe(-120)).toBe('next')
  })

  it('goes to the previous slide on a clear right swipe', () => {
    expect(resolveSwipe(SWIPE_THRESHOLD_PX)).toBe('prev')
    expect(resolveSwipe(120)).toBe('prev')
  })

  it('ignores gestures shorter than the threshold (treats them as taps)', () => {
    expect(resolveSwipe(0)).toBe('none')
    expect(resolveSwipe(-(SWIPE_THRESHOLD_PX - 1))).toBe('none')
    expect(resolveSwipe(SWIPE_THRESHOLD_PX - 1)).toBe('none')
  })

  it('honours a custom threshold', () => {
    expect(resolveSwipe(30, 20)).toBe('prev')
    expect(resolveSwipe(30, 50)).toBe('none')
  })
})
