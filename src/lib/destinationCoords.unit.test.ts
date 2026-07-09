import { describe, expect, it } from 'vitest'

import { destinationCoord, toWaypoints } from './destinationCoords'

/**
 * The globe hero's waypoints (issue #28) come from a static name → coordinate
 * table since Destinations carry no lat/lng. The lookup must be forgiving about
 * casing/whitespace, place every seeded destination, and skip unknown names so a
 * new/edited destination degrades to "no marker" rather than crashing.
 */
describe('destinationCoord', () => {
  it('places a known destination by name', () => {
    expect(destinationCoord('Turkey')).toEqual([28.98, 41.01])
  })

  it('is case- and whitespace-insensitive', () => {
    expect(destinationCoord('  maldives ')).toEqual(destinationCoord('Maldives'))
    expect(destinationCoord('EGYPT')).toEqual(destinationCoord('Egypt'))
  })

  it('resolves the multi-word and aliased names', () => {
    expect(destinationCoord('United Arab Emirates')).toEqual(destinationCoord('UAE'))
    expect(destinationCoord('Georgia and Armenia')).toEqual(destinationCoord('Georgia'))
  })

  it('covers every seeded destination', () => {
    const seededNames = [
      'Turkey',
      'Maldives',
      'Italy',
      'France',
      'Greece',
      'Egypt',
      'Indonesia',
      'Spain',
      'Cyprus',
      'United Arab Emirates',
      'Thailand',
      'Georgia and Armenia',
    ]
    for (const name of seededNames) expect(destinationCoord(name)).not.toBeNull()
  })

  it('returns null for an unknown destination', () => {
    expect(destinationCoord('Atlantis')).toBeNull()
  })
})

describe('toWaypoints', () => {
  it('maps placeable destinations to waypoints, preserving order', () => {
    const waypoints = toWaypoints([
      { name: 'Turkey', slug: 'turkey' },
      { name: 'Maldives', slug: 'maldives' },
    ])
    expect(waypoints).toEqual([
      { name: 'Turkey', slug: 'turkey', coord: [28.98, 41.01] },
      { name: 'Maldives', slug: 'maldives', coord: [73.51, 3.2] },
    ])
  })

  it('silently drops destinations it cannot place', () => {
    const waypoints = toWaypoints([
      { name: 'Turkey', slug: 'turkey' },
      { name: 'Narnia', slug: 'narnia' },
    ])
    expect(waypoints.map((w) => w.slug)).toEqual(['turkey'])
  })
})
