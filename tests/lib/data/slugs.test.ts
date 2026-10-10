// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { uniqueSlug } from '@/lib/data/slugs'

describe('uniqueSlug', () => {
  it('keeps the base when nothing has taken it', () => {
    expect(uniqueSlug('dune-2021', [])).toBe('dune-2021')
    expect(uniqueSlug('dune-2021', ['dune-1984', 'dune-2021-trailer'])).toBe('dune-2021')
  })

  it('numbers from 2 and skips every taken suffix', () => {
    expect(uniqueSlug('dune-2021', ['dune-2021'])).toBe('dune-2021-2')
    expect(uniqueSlug('dune-2021', ['dune-2021', 'dune-2021-2'])).toBe('dune-2021-3')
    expect(uniqueSlug('dune-2021', ['dune-2021', 'dune-2021-3'])).toBe('dune-2021-2')
  })
})
