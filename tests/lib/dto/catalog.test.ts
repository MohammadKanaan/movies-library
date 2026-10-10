import { describe, expect, it } from 'vitest'
import {
  catalogIdSchema,
  SLUG_MAX_LENGTH,
  slugListParamSchema,
  slugSchema,
} from '@/lib/dto/catalog'

const ID = '0190d1a2-0000-7000-8000-000000000001'

describe('slugSchema', () => {
  it('accepts what slugify produces, with or without a numeric suffix', () => {
    expect(slugSchema.parse('dune-2021')).toBe('dune-2021')
    expect(slugSchema.parse(' dune-2021-2 ')).toBe('dune-2021-2')
    expect(slugSchema.parse('x')).toBe('x')
  })

  it('rejects anything that is not lowercase words joined by single hyphens', () => {
    for (const bad of [
      '',
      'Dune',
      'a--b',
      '-a',
      'a-',
      'a b',
      'a/b',
      'a'.repeat(SLUG_MAX_LENGTH + 1),
    ]) {
      expect(slugSchema.safeParse(bad).success).toBe(false)
    }
  })
})

describe('slugListParamSchema', () => {
  it('splits a comma-separated list, dropping blanks and duplicates', () => {
    expect(slugListParamSchema.parse('drama, sci-fi,,drama')).toEqual(['drama', 'sci-fi'])
    expect(slugListParamSchema.parse('')).toEqual([])
    expect(slugListParamSchema.parse(',')).toEqual([])
  })

  it('refuses the whole list when one entry is not a slug', () => {
    expect(slugListParamSchema.safeParse('drama,Sci Fi').success).toBe(false)
  })
})

describe('catalogIdSchema', () => {
  it('takes only a UUID', () => {
    expect(catalogIdSchema.safeParse(ID).success).toBe(true)
    expect(catalogIdSchema.safeParse('1').success).toBe(false)
    expect(catalogIdSchema.safeParse('a b').error?.issues[0]?.message).toBe('Invalid id')
  })
})
