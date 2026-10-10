import { describe, expect, it } from 'vitest'
import { MAX_PAGE } from '@/lib/dto/common'
import {
  attachPosterInput,
  EMPTY_MOVIE_FILTERS,
  hasMovieFilters,
  listMoviesQuery,
  MOVIE_CREDITS_MAX,
  MOVIE_FILTER_KEYS,
  MOVIE_GENRES_MAX,
  MOVIE_RUNTIME_MAX_MINUTES,
  MOVIE_SEARCH_MAX_LENGTH,
  MOVIE_SORTS,
  MOVIE_SYNOPSIS_MAX_LENGTH,
  MOVIE_TITLE_MAX_LENGTH,
  MOVIE_YEAR_MIN,
  movieDetailSchema,
  movieInput,
  movieSortSchema,
  movieSummarySchema,
  moviesUrlQuery,
  toListMoviesQuery,
  updateMovieInput,
} from '@/lib/dto/movies'

const ID = '0190d1a2-0000-7000-8000-000000000001'
const GENRE_ID = '0190d1a2-0000-7000-8000-000000000002'
const PERSON_ID = '0190d1a2-0000-7000-8000-000000000003'
const OTHER_PERSON_ID = '0190d1a2-0000-7000-8000-000000000004'

const valid = {
  title: 'Dune',
  synopsis: 'Paul Atreides travels to Arrakis.',
  releaseDate: '2021-10-22',
  runtimeMinutes: 155,
  genreIds: [GENRE_ID],
  credits: [
    { personId: PERSON_ID, role: 'DIRECTOR' },
    { personId: PERSON_ID, role: 'WRITER' },
    { personId: OTHER_PERSON_ID, role: 'ACTOR' },
  ],
} as const

const issuesOf = (input: unknown) =>
  movieInput
    .safeParse(input)
    .error?.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)

describe('movieInput', () => {
  it('accepts a full movie and keeps the credits in order, unstarred unless marked', () => {
    expect(movieInput.parse(valid)).toEqual({
      ...valid,
      credits: valid.credits.map((credit) => ({ ...credit, star: false })),
    })
  })

  it('trims the title and bounds it', () => {
    expect(movieInput.parse({ ...valid, title: '  Dune ' }).title).toBe('Dune')
    expect(issuesOf({ ...valid, title: '  ' })).toEqual(['title: Title is required'])
    expect(issuesOf({ ...valid, title: 'a'.repeat(MOVIE_TITLE_MAX_LENGTH + 1) })).toEqual([
      `title: Title must be ${MOVIE_TITLE_MAX_LENGTH} characters or fewer`,
    ])
  })

  it('turns a missing or blank synopsis and runtime into null', () => {
    const { synopsis, runtimeMinutes, ...rest } = valid
    void synopsis
    void runtimeMinutes
    expect(movieInput.parse(rest)).toMatchObject({ synopsis: null, runtimeMinutes: null })
    expect(movieInput.parse({ ...valid, synopsis: '   ', runtimeMinutes: null })).toMatchObject({
      synopsis: null,
      runtimeMinutes: null,
    })
    expect(issuesOf({ ...valid, synopsis: 'a'.repeat(MOVIE_SYNOPSIS_MAX_LENGTH + 1) })).toEqual([
      `synopsis: Synopsis must be ${MOVIE_SYNOPSIS_MAX_LENGTH} characters or fewer`,
    ])
  })

  it('takes the release date as a calendar day between the first films and today', () => {
    const today = new Date().toISOString().slice(0, 10)
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    expect(movieInput.parse({ ...valid, releaseDate: '1895-12-28' }).releaseDate).toBe('1895-12-28')
    expect(movieInput.parse({ ...valid, releaseDate: today }).releaseDate).toBe(today)
    for (const bad of ['2021-13-01', '22/10/2021', '2021-10-22T00:00:00Z', '1800-01-01', '']) {
      expect(issuesOf({ ...valid, releaseDate: bad })?.[0]).toMatch(/^releaseDate: /)
    }
    // Released films only: tomorrow is refused.
    expect(issuesOf({ ...valid, releaseDate: tomorrow })).toEqual([
      'releaseDate: Enter a release date between 1888 and today',
    ])
  })

  it('bounds the runtime to whole positive minutes', () => {
    expect(issuesOf({ ...valid, runtimeMinutes: 0 })).toHaveLength(1)
    expect(issuesOf({ ...valid, runtimeMinutes: 90.5 })).toHaveLength(1)
    expect(issuesOf({ ...valid, runtimeMinutes: 1001 })).toHaveLength(1)
  })

  it('wants genre ids as UUIDs, no duplicates, at most the cap', () => {
    expect(movieInput.parse({ ...valid, genreIds: [] }).genreIds).toEqual([])
    expect(issuesOf({ ...valid, genreIds: ['1'] })?.[0]).toMatch(/^genreIds\.0: /)
    expect(issuesOf({ ...valid, genreIds: [GENRE_ID, GENRE_ID] })).toEqual([
      'genreIds: A genre is listed twice',
    ])
    const many = Array.from(
      { length: MOVIE_GENRES_MAX + 1 },
      (_value, index) => `0190d1a2-0000-7000-8000-${String(index).padStart(12, '0')}`,
    )
    expect(issuesOf({ ...valid, genreIds: many })?.[0]).toMatch(/^genreIds: /)
  })

  it('refuses the same person twice in one role but allows them in two roles', () => {
    expect(
      issuesOf({
        ...valid,
        credits: [
          { personId: PERSON_ID, role: 'ACTOR' },
          { personId: PERSON_ID, role: 'ACTOR' },
        ],
      }),
    ).toEqual(['credits: A person is credited twice in the same role'])
    expect(
      issuesOf({ ...valid, credits: [{ personId: PERSON_ID, role: 'producer' }] })?.[0],
    ).toMatch(/^credits\.0\.role: /)
    const cast = Array.from({ length: MOVIE_CREDITS_MAX + 1 }, (_value, index) => ({
      personId: `0190d1a2-0000-7000-8000-${String(index).padStart(12, '0')}`,
      role: 'ACTOR',
    }))
    expect(issuesOf({ ...valid, credits: cast })?.[0]).toMatch(/^credits: /)
  })

  it('stars cast members only', () => {
    const starred = { personId: OTHER_PERSON_ID, role: 'ACTOR', star: true } as const
    expect(movieInput.parse({ ...valid, credits: [starred] }).credits).toEqual([starred])
    expect(
      issuesOf({ ...valid, credits: [{ personId: PERSON_ID, role: 'DIRECTOR', star: true }] }),
    ).toEqual(['credits: Only cast members can be stars'])
    expect(issuesOf({ ...valid, credits: [{ ...starred, star: 'yes' }] })?.[0]).toMatch(
      /^credits\.0\.star: /,
    )
  })

  it('needs a movie id to update, and a movie id plus an upload key to attach a poster', () => {
    expect(updateMovieInput.parse({ ...valid, id: ID }).id).toBe(ID)
    expect(updateMovieInput.safeParse({ ...valid, id: 'x' }).success).toBe(false)
    const key = `posters/${crypto.randomUUID()}/${crypto.randomUUID()}`
    expect(attachPosterInput.parse({ id: ID, key })).toEqual({ id: ID, key })
    expect(attachPosterInput.safeParse({ id: ID, key: 'nope' }).success).toBe(false)
  })
})

describe('movie list', () => {
  it('defaults the sort to newest and accepts the known sorts only', () => {
    expect(movieSortSchema.parse(undefined)).toBe('newest')
    // `added` orders by when the catalog gained the movie (the admin list's default).
    expect(MOVIE_SORTS).toEqual(['newest', 'oldest', 'title', 'added'])
    expect(listMoviesQuery.parse({})).toEqual({ page: 1, perPage: 10, sort: 'newest' })
    expect(listMoviesQuery.safeParse({ sort: 'rating' }).success).toBe(false)
  })

  it('bounds the search and takes the genre and person filters as slugs', () => {
    expect(
      listMoviesQuery.parse({
        q: ' dune ',
        genres: ['sci-fi', 'drama'],
        person: 'denis-villeneuve',
      }),
    ).toMatchObject({
      q: 'dune',
      genres: ['sci-fi', 'drama'],
      person: 'denis-villeneuve',
    })
    expect(listMoviesQuery.safeParse({ q: 'a'.repeat(MOVIE_SEARCH_MAX_LENGTH + 1) }).success).toBe(
      false,
    )
    // The trigram index cannot serve fewer than three characters.
    expect(listMoviesQuery.safeParse({ q: 'du' }).success).toBe(false)
    expect(listMoviesQuery.parse({ q: '  ' }).q).toBe('')
    expect(listMoviesQuery.safeParse({ genres: ['Sci Fi'] }).success).toBe(false)
    expect(
      listMoviesQuery.safeParse({
        genres: Array.from({ length: MOVIE_GENRES_MAX + 1 }, (_, i) => `g${i}`),
      }).success,
    ).toBe(false)
    expect(listMoviesQuery.safeParse({ page: String(MAX_PAGE + 1) }).success).toBe(false)
  })

  it('takes year and runtime ranges, open at either end, the first not after the last', () => {
    const thisYear = new Date().getUTCFullYear()
    expect(
      listMoviesQuery.parse({ yearFrom: '1990', yearTo: 2000, runtimeMin: '90', runtimeMax: 120 }),
    ).toMatchObject({ yearFrom: 1990, yearTo: 2000, runtimeMin: 90, runtimeMax: 120 })
    expect(listMoviesQuery.parse({ yearTo: thisYear, runtimeMin: 1 })).toMatchObject({
      yearTo: thisYear,
      runtimeMin: 1,
    })
    const issuesOf = (input: unknown) =>
      listMoviesQuery
        .safeParse(input)
        .error?.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    expect(issuesOf({ yearFrom: MOVIE_YEAR_MIN - 1 })).toEqual([
      `yearFrom: Enter a year between ${MOVIE_YEAR_MIN} and this year`,
    ])
    expect(issuesOf({ yearTo: thisYear + 1 })?.[0]).toMatch(/^yearTo: /)
    expect(issuesOf({ yearFrom: '19x0' })?.[0]).toMatch(/^yearFrom: /)
    expect(issuesOf({ runtimeMin: 0 })).toEqual(['runtimeMin: Enter at least 1 minute'])
    expect(issuesOf({ runtimeMax: MOVIE_RUNTIME_MAX_MINUTES + 1 })?.[0]).toMatch(/^runtimeMax: /)
    expect(issuesOf({ yearFrom: 2000, yearTo: 1990 })).toEqual([
      'yearTo: The last year is before the first',
    ])
    expect(issuesOf({ runtimeMin: 120, runtimeMax: 90 })).toEqual([
      'runtimeMax: The longest runtime is shorter than the shortest',
    ])
  })

  it('parses any URL by falling back per field', () => {
    const empty = {
      page: 1,
      q: '',
      genres: [],
      person: '',
      yearFrom: null,
      yearTo: null,
      runtimeMin: null,
      runtimeMax: null,
      sort: 'newest',
    }
    expect(moviesUrlQuery.parse({})).toEqual(empty)
    expect(
      moviesUrlQuery.parse({
        page: 'abc',
        q: 'a'.repeat(101),
        genres: 'Sci Fi',
        person: '!',
        yearFrom: '',
        yearTo: 'soon',
        runtimeMin: '0',
        runtimeMax: '1e9',
        sort: 'x',
      }),
    ).toEqual(empty)
    expect(moviesUrlQuery.parse({ q: 'du' }).q).toBe('')
    expect(
      moviesUrlQuery.parse({
        page: '2',
        q: ' dune ',
        genres: 'sci-fi,drama,sci-fi',
        yearFrom: '1990',
        runtimeMax: '120',
        sort: 'title',
      }),
    ).toEqual({
      ...empty,
      page: 2,
      q: 'dune',
      genres: ['sci-fi', 'drama'],
      yearFrom: 1990,
      runtimeMax: 120,
      sort: 'title',
    })
  })

  it('tells filters from paging and sort', () => {
    const none = moviesUrlQuery.parse({ page: '3', sort: 'title' })
    expect(hasMovieFilters(none)).toBe(false)
    expect(hasMovieFilters({ ...none, genres: ['drama'] })).toBe(true)
    expect(hasMovieFilters({ ...none, yearTo: 1999 })).toBe(true)
    expect(hasMovieFilters({ ...none, q: 'dune' })).toBe(true)
    expect(hasMovieFilters(EMPTY_MOVIE_FILTERS)).toBe(false)
    expect(MOVIE_FILTER_KEYS).toEqual([
      'q',
      'genres',
      'person',
      'yearFrom',
      'yearTo',
      'runtimeMin',
      'runtimeMax',
    ])
  })

  it('turns a URL into the list query, leaving empty filters out and righting a reversed range', () => {
    expect(toListMoviesQuery(moviesUrlQuery.parse({}))).toEqual({
      page: 1,
      sort: 'newest',
      q: undefined,
      genres: undefined,
      person: undefined,
      yearFrom: undefined,
      yearTo: undefined,
      runtimeMin: undefined,
      runtimeMax: undefined,
    })
    expect(
      toListMoviesQuery(
        moviesUrlQuery.parse({
          page: '2',
          q: 'dune',
          genres: 'drama',
          person: 'amy-adams',
          yearFrom: '2010',
          yearTo: '2000',
          runtimeMin: '120',
          runtimeMax: '90',
          sort: 'oldest',
        }),
      ),
    ).toEqual({
      page: 2,
      sort: 'oldest',
      q: 'dune',
      genres: ['drama'],
      person: 'amy-adams',
      yearFrom: 2000,
      yearTo: 2010,
      runtimeMin: 90,
      runtimeMax: 120,
    })
    // What the pages pass always parses.
    expect(
      listMoviesQuery.safeParse(
        toListMoviesQuery(moviesUrlQuery.parse({ yearFrom: '2010', yearTo: '2000' })),
      ).success,
    ).toBe(true)
  })
})

describe('movie outputs', () => {
  const summary = {
    id: ID,
    slug: 'dune-2021',
    title: 'Dune',
    releaseDate: new Date('2021-10-22T00:00:00Z'),
    runtimeMinutes: 155,
    posterUrl: null,
    genres: [{ id: GENRE_ID, name: 'Science Fiction', slug: 'science-fiction' }],
  }

  it('revive the release date of a summary after a JSON round trip', () => {
    expect(movieSummarySchema.parse(JSON.parse(JSON.stringify(summary)))).toEqual(summary)
  })

  it('carry the synopsis, creator, grouped credits and permissions in the detail', () => {
    const detail = movieDetailSchema.parse(
      JSON.parse(
        JSON.stringify({
          ...summary,
          synopsis: null,
          createdBy: { id: PERSON_ID, name: 'Ada Admin', username: 'admin' },
          createdAt: new Date('2026-01-01T00:00:00Z'),
          updatedAt: new Date('2026-01-01T00:00:00Z'),
          credits: {
            directors: [
              {
                id: PERSON_ID,
                slug: 'denis-villeneuve',
                name: 'Denis Villeneuve',
                headshotUrl: null,
              },
            ],
            writers: [],
            cast: [],
          },
          permissions: { update: true, delete: true },
        }),
      ),
    )
    expect(detail.createdAt).toBeInstanceOf(Date)
    expect(detail.credits.directors[0]?.name).toBe('Denis Villeneuve')
    expect(movieDetailSchema.safeParse({ ...summary, synopsis: null }).success).toBe(false)
  })
})
