import { describe, expect, it } from 'vitest'
import { MAX_PAGE } from '@/lib/dto/common'
import {
  attachPosterInput,
  listMoviesQuery,
  MOVIE_CREDITS_MAX,
  MOVIE_GENRES_MAX,
  MOVIE_SEARCH_MAX_LENGTH,
  MOVIE_SORTS,
  MOVIE_SYNOPSIS_MAX_LENGTH,
  MOVIE_TITLE_MAX_LENGTH,
  movieDetailSchema,
  movieInput,
  movieSortSchema,
  movieSummarySchema,
  moviesUrlQuery,
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
  it('accepts a full movie and keeps the credits in order', () => {
    expect(movieInput.parse(valid)).toEqual(valid)
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

  it('bounds the search and takes genre and person filters as slugs', () => {
    expect(
      listMoviesQuery.parse({ q: ' dune ', genre: 'sci-fi', person: 'denis-villeneuve' }),
    ).toMatchObject({
      q: 'dune',
      genre: 'sci-fi',
      person: 'denis-villeneuve',
    })
    expect(listMoviesQuery.safeParse({ q: 'a'.repeat(MOVIE_SEARCH_MAX_LENGTH + 1) }).success).toBe(
      false,
    )
    // The trigram index cannot serve fewer than three characters.
    expect(listMoviesQuery.safeParse({ q: 'du' }).success).toBe(false)
    expect(listMoviesQuery.parse({ q: '  ' }).q).toBe('')
    expect(listMoviesQuery.safeParse({ genre: 'Sci Fi' }).success).toBe(false)
    expect(listMoviesQuery.safeParse({ page: String(MAX_PAGE + 1) }).success).toBe(false)
  })

  it('parses any URL by falling back per field', () => {
    expect(moviesUrlQuery.parse({})).toEqual({
      page: 1,
      q: '',
      genre: '',
      person: '',
      sort: 'newest',
    })
    expect(
      moviesUrlQuery.parse({
        page: 'abc',
        q: 'a'.repeat(101),
        genre: 'Sci Fi',
        person: '!',
        sort: 'x',
      }),
    ).toEqual({ page: 1, q: '', genre: '', person: '', sort: 'newest' })
    expect(moviesUrlQuery.parse({ q: 'du' }).q).toBe('')
    expect(
      moviesUrlQuery.parse({ page: '2', q: ' dune ', genre: 'sci-fi', sort: 'title' }),
    ).toEqual({
      page: 2,
      q: 'dune',
      genre: 'sci-fi',
      person: '',
      sort: 'title',
    })
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
            directors: [{ id: PERSON_ID, slug: 'denis-villeneuve', name: 'Denis Villeneuve' }],
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
