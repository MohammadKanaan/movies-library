import { describe, expect, it } from 'vitest'
import {
  isSearchable,
  SEARCH_LIMIT_DEFAULT,
  SEARCH_LIMIT_MAX,
  SEARCH_MAX_LENGTH,
  searchCatalogQuery,
  searchResultsSchema,
  searchUrlQuery,
} from '@/lib/dto/search'

describe('searchCatalogQuery', () => {
  it('trims the term, needs three characters and defaults the limit', () => {
    expect(searchCatalogQuery.parse({ q: ' dune ' })).toEqual({
      q: 'dune',
      limit: SEARCH_LIMIT_DEFAULT,
    })
    expect(searchCatalogQuery.parse({ q: 'dune', limit: '5' }).limit).toBe(5)
    const issuesOf = (input: unknown) =>
      searchCatalogQuery
        .safeParse(input)
        .error?.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    expect(issuesOf({ q: 'du' })).toEqual(['q: Search needs at least 3 characters'])
    expect(issuesOf({ q: '   ' })).toEqual(['q: Search needs at least 3 characters'])
    expect(issuesOf({})?.[0]).toMatch(/^q: /)
    expect(issuesOf({ q: 'a'.repeat(SEARCH_MAX_LENGTH + 1) })).toEqual([
      `q: Search must be ${SEARCH_MAX_LENGTH} characters or fewer`,
    ])
    expect(issuesOf({ q: 'dune', limit: 0 })?.[0]).toMatch(/^limit: /)
    expect(issuesOf({ q: 'dune', limit: SEARCH_LIMIT_MAX + 1 })?.[0]).toMatch(/^limit: /)
  })
})

describe('searchUrlQuery', () => {
  it('keeps a short term so the page can show it back, and bounds a long one', () => {
    expect(searchUrlQuery.parse({})).toEqual({ q: '' })
    expect(searchUrlQuery.parse({ q: ' du ' })).toEqual({ q: 'du' })
    expect(searchUrlQuery.parse({ q: 'a'.repeat(SEARCH_MAX_LENGTH + 1) })).toEqual({ q: '' })
    expect(isSearchable('du')).toBe(false)
    expect(isSearchable(' dun ')).toBe(true)
  })
})

describe('searchResultsSchema', () => {
  it('revives dates after a JSON round trip', () => {
    const results = {
      q: 'dune',
      movies: {
        items: [
          {
            id: '0190d1a2-0000-7000-8000-000000000001',
            slug: 'dune-2021',
            title: 'Dune',
            releaseDate: new Date('2021-10-22T00:00:00.000Z'),
            runtimeMinutes: 155,
            posterUrl: null,
            genres: [],
          },
        ],
        totalItems: 3,
      },
      people: {
        items: [
          {
            id: '0190d1a2-0000-7000-8000-000000000002',
            slug: 'denis-villeneuve',
            name: 'Denis Villeneuve',
            headshotUrl: null,
            creditCount: 2,
            createdAt: new Date('2026-01-01T00:00:00.000Z'),
          },
        ],
        totalItems: 1,
      },
    }
    expect(searchResultsSchema.parse(JSON.parse(JSON.stringify(results)))).toEqual(results)
    expect(
      searchResultsSchema.safeParse({ ...results, movies: { items: [], totalItems: -1 } }).success,
    ).toBe(false)
  })
})
