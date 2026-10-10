import { describe, expect, it } from 'vitest'
import { fromThumbs, toThumbs } from '@/lib/filterRange'

describe('toThumbs', () => {
  it('rests an open end at the end of the track', () => {
    expect(toThumbs({ from: null, to: null }, 30, 240)).toEqual([30, 240])
    expect(toThumbs({ from: 90, to: null }, 30, 240)).toEqual([90, 240])
    expect(toThumbs({ from: null, to: 120 }, 30, 240)).toEqual([30, 120])
  })

  it('keeps a bound the track cannot show on its end', () => {
    expect(toThumbs({ from: 10, to: 600 }, 30, 240)).toEqual([30, 240])
  })

  it('puts a reversed range the right way round', () => {
    expect(toThumbs({ from: 150, to: 90 }, 30, 240)).toEqual([90, 150])
  })
})

describe('fromThumbs', () => {
  const none = { from: null, to: null }

  it('reads a thumb resting at an end of the track as an open end', () => {
    expect(fromThumbs([30, 240], none, 30, 240)).toEqual({ from: null, to: null })
    expect(fromThumbs([90, 240], none, 30, 240)).toEqual({ from: 90, to: null })
    expect(fromThumbs([30, 120], none, 30, 240)).toEqual({ from: null, to: 120 })
    expect(fromThumbs([90, 150], none, 30, 240)).toEqual({ from: 90, to: 150 })
  })

  it('keeps a bound beyond the track while its thumb has not left that end', () => {
    // The URL says 10–600 minutes; the track shows 30–240. Moving only the lower thumb must not
    // silently drop the upper bound the track cannot display.
    const current = { from: 10, to: 600 }
    expect(fromThumbs([60, 240], current, 30, 240)).toEqual({ from: 60, to: 600 })
    expect(fromThumbs([30, 120], current, 30, 240)).toEqual({ from: 10, to: 120 })
  })

  it('opens an end whose thumb returns to it when the bound was on the track', () => {
    expect(fromThumbs([30, 120], { from: 90, to: 120 }, 30, 240)).toEqual({ from: null, to: 120 })
  })
})
