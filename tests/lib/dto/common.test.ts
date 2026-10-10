import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import {
  booleanParamSchema,
  MAX_PAGE,
  MAX_PER_PAGE,
  pageQuerySchema,
  pageSchema,
  SEARCH_MIN_LENGTH,
  searchTermSchema,
  toPage,
} from '@/lib/dto/common'

describe('pageQuerySchema', () => {
  it('defaults missing values and coerces query strings', () => {
    expect(pageQuerySchema.parse({})).toEqual({ page: 1, perPage: 10 })
    expect(pageQuerySchema.parse({ page: '3', perPage: '5' })).toEqual({ page: 3, perPage: 5 })
  })

  it('rejects zero, negatives, non-numbers, and oversized pages', () => {
    for (const input of [
      { page: '0' },
      { page: '-1' },
      { page: 'abc' },
      { page: String(MAX_PAGE + 1) },
      { perPage: MAX_PER_PAGE + 1 },
    ]) {
      expect(pageQuerySchema.safeParse(input).success, JSON.stringify(input)).toBe(false)
    }
    expect(pageQuerySchema.parse({ page: String(MAX_PAGE) }).page).toBe(MAX_PAGE)
  })
})

describe('searchTermSchema', () => {
  const schema = searchTermSchema(10)

  it('trims and accepts an empty term or one of at least three characters', () => {
    expect(schema.parse('  dune ')).toBe('dune')
    expect(schema.parse('   ')).toBe('')
    expect(schema.parse('abc')).toBe('abc')
  })

  it('rejects one or two characters, which the trigram index cannot serve', () => {
    expect(schema.safeParse('d').success).toBe(false)
    expect(schema.safeParse(' du ').success).toBe(false)
    expect(schema.safeParse('ab'.padEnd(SEARCH_MIN_LENGTH - 1, 'x')).success).toBe(false)
  })

  it('rejects a term over the given maximum', () => {
    expect(schema.safeParse('a'.repeat(11)).success).toBe(false)
    expect(schema.parse('a'.repeat(10))).toBe('a'.repeat(10))
  })
})

describe('booleanParamSchema', () => {
  it('accepts a boolean as it is', () => {
    expect(booleanParamSchema.parse(true)).toBe(true)
    expect(booleanParamSchema.parse(false)).toBe(false)
  })

  it('reads the strings a query string carries', () => {
    expect(booleanParamSchema.parse('true')).toBe(true)
    // `z.coerce.boolean()` would read this as true.
    expect(booleanParamSchema.parse('false')).toBe(false)
  })

  it('rejects anything else', () => {
    for (const input of ['maybe', '', 1, 0, null, undefined]) {
      expect(booleanParamSchema.safeParse(input).success, String(input)).toBe(false)
    }
  })
})

describe('toPage', () => {
  it('computes total pages and never reports zero pages', () => {
    expect(toPage(['a', 'b'], 5, { page: 1, perPage: 2 })).toEqual({
      items: ['a', 'b'],
      page: 1,
      perPage: 2,
      totalItems: 5,
      totalPages: 3,
    })
    expect(toPage([], 0, { page: 1, perPage: 10 }).totalPages).toBe(1)
  })

  it('round-trips through pageSchema', () => {
    const page = toPage([1, 2], 2, { page: 1, perPage: 10 })
    expect(pageSchema(z.number()).parse(page)).toEqual(page)
  })
})
