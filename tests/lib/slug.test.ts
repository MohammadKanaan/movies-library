import { describe, expect, it } from 'vitest'
import { SLUG_MAX_LENGTH, slugify } from '@/lib/slug'

describe('slugify', () => {
  it('lowercases and joins words with single hyphens', () => {
    expect(slugify('The Lord of the Rings')).toBe('the-lord-of-the-rings')
    expect(slugify('  Blade   Runner  ')).toBe('blade-runner')
  })

  it('strips diacritics and punctuation', () => {
    expect(slugify('Amélie')).toBe('amelie')
    expect(slugify('WALL·E')).toBe('wall-e')
    expect(slugify("Ocean's Eleven: Part 2!")).toBe('ocean-s-eleven-part-2')
  })

  it('never starts or ends with a hyphen', () => {
    expect(slugify('--Dune--')).toBe('dune')
    expect(slugify('(500) Days of Summer')).toBe('500-days-of-summer')
  })

  it('returns an empty string when nothing is left', () => {
    expect(slugify('')).toBe('')
    expect(slugify('!!!')).toBe('')
    expect(slugify('日本')).toBe('')
  })

  it('caps the length without leaving a trailing hyphen', () => {
    const long = Array.from({ length: 40 }, () => 'ab').join(' ')
    const slug = slugify(long)
    expect(slug.length).toBeLessThanOrEqual(SLUG_MAX_LENGTH)
    expect(slug.endsWith('-')).toBe(false)
    expect(SLUG_MAX_LENGTH).toBe(80)
  })
})
