import { describe, expect, it } from 'vitest'

import { trapTabIndex } from './focusTrap'

/**
 * The Marlo assistant panel (issue #30) traps keyboard focus while open, so Tab
 * and Shift+Tab cycle within the panel instead of escaping to the page behind
 * it. This pure helper encodes the wrap decision — given how many focusable
 * elements the panel has, which one currently holds focus, and the Tab
 * direction — so the trapping can be asserted without a DOM. It returns the
 * index to move focus to when Tab would otherwise leave the trap, or `null` to
 * let the browser handle the move normally.
 */
describe('trapTabIndex', () => {
  it('wraps forward from the last element back to the first', () => {
    expect(trapTabIndex({ count: 3, currentIndex: 2, shiftKey: false })).toBe(0)
  })

  it('wraps backward from the first element to the last', () => {
    expect(trapTabIndex({ count: 3, currentIndex: 0, shiftKey: true })).toBe(2)
  })

  it('lets the browser handle a Tab that stays inside the trap', () => {
    expect(trapTabIndex({ count: 3, currentIndex: 0, shiftKey: false })).toBeNull()
    expect(trapTabIndex({ count: 3, currentIndex: 1, shiftKey: true })).toBeNull()
  })

  it('pulls stray focus into the trap (first on Tab, last on Shift+Tab)', () => {
    expect(trapTabIndex({ count: 3, currentIndex: -1, shiftKey: false })).toBe(0)
    expect(trapTabIndex({ count: 3, currentIndex: -1, shiftKey: true })).toBe(2)
  })

  it('keeps focus on the sole focusable element in both directions', () => {
    expect(trapTabIndex({ count: 1, currentIndex: 0, shiftKey: false })).toBe(0)
    expect(trapTabIndex({ count: 1, currentIndex: 0, shiftKey: true })).toBe(0)
  })

  it('does nothing when there is nothing to focus', () => {
    expect(trapTabIndex({ count: 0, currentIndex: -1, shiftKey: false })).toBeNull()
    expect(trapTabIndex({ count: 0, currentIndex: -1, shiftKey: true })).toBeNull()
  })
})
