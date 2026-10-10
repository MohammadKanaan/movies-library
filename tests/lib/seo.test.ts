import { describe, expect, it } from 'vitest'
import type { CreditRole } from '@/lib/dto/catalog'
import type { MovieDetail } from '@/lib/dto/movies'
import { moviesUrlQuery } from '@/lib/dto/movies'
import type { PersonDetail } from '@/lib/dto/people'
import type { ReviewDetail } from '@/lib/dto/reviews'
import { env } from '@/lib/env'
import {
  describeMovie,
  describePerson,
  describeReview,
  META_DESCRIPTION_MAX_LENGTH,
  metaDescription,
  moviesCanonicalPath,
  pagedPath,
  pagedTitle,
} from '@/lib/seo'

const person = (name: string) => ({
  id: name,
  slug: name.toLowerCase().replace(/\s+/g, '-'),
  name,
  headshotUrl: null,
})

const movie = (overrides: Partial<MovieDetail> = {}): MovieDetail => ({
  id: 'm1',
  slug: 'arrival-2016',
  title: 'Arrival',
  releaseDate: new Date('2016-11-11T00:00:00.000Z'),
  runtimeMinutes: 116,
  posterUrl: null,
  genres: [],
  rating: { average: null, count: 0 },
  synopsis: null,
  createdBy: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  credits: { directors: [], writers: [], cast: [] },
  permissions: { update: false, delete: false },
  ...overrides,
})

const credit = (title: string, roles: CreditRole[]) => ({
  id: title,
  slug: title.toLowerCase(),
  title,
  releaseDate: new Date('2016-11-11T00:00:00.000Z'),
  runtimeMinutes: null,
  posterUrl: null,
  genres: [],
  rating: { average: null, count: 0 },
  roles,
})

const personDetail = (overrides: Partial<PersonDetail> = {}): PersonDetail => ({
  ...person('Denis Villeneuve'),
  bio: null,
  birthDate: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  filmography: [],
  permissions: { update: false, delete: false },
  ...overrides,
})

const review = (overrides: Partial<ReviewDetail> = {}): ReviewDetail => ({
  id: 'r1',
  movieId: 'm1',
  rating: 4.5,
  body: null,
  spoiler: false,
  createdAt: new Date('2026-02-01T00:00:00.000Z'),
  updatedAt: new Date('2026-02-01T00:00:00.000Z'),
  commentCount: 0,
  author: { id: 'u1', name: 'Ada', username: 'ada', image: null },
  permissions: { update: false, delete: false },
  movie: {
    id: 'm1',
    slug: 'arrival-2016',
    title: 'Arrival',
    releaseDate: new Date('2016-11-11T00:00:00.000Z'),
    posterUrl: null,
  },
  ...overrides,
})

describe('metaDescription', () => {
  it('collapses whitespace and keeps a short text whole', () => {
    expect(metaDescription('  A linguist\n\n is   recruited.  ')).toBe('A linguist is recruited.')
  })

  it('cuts a long text at the last whole word that fits, with an ellipsis', () => {
    const text = `${'word '.repeat(40)}end`
    const description = metaDescription(text)
    expect(description.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX_LENGTH)
    expect(description).toMatch(/^(word )+word…$/)
  })

  it('drops the punctuation the cut leaves dangling', () => {
    expect(metaDescription('One, two, three, four', 11)).toBe('One, two…')
  })
})

describe('pagedTitle and pagedPath', () => {
  it('leave the first page alone', () => {
    expect(pagedTitle('People', 1)).toBe('People')
    expect(pagedPath('/people', 1)).toBe('/people')
  })

  it('name a later page', () => {
    expect(pagedTitle('People', 3)).toBe('People · Page 3')
    expect(pagedPath('/people', 3)).toBe('/people?page=3')
  })
})

describe('moviesCanonicalPath', () => {
  const canonical = (search: Record<string, string>) =>
    moviesCanonicalPath(moviesUrlQuery.parse(search))

  it('is the plain list, page by page', () => {
    expect(canonical({})).toBe('/movies')
    expect(canonical({ page: '2' })).toBe('/movies?page=2')
  })

  it('is a single genre, page by page', () => {
    expect(canonical({ genres: 'drama' })).toBe('/movies?genres=drama')
    expect(canonical({ genres: 'drama', page: '2' })).toBe('/movies?genres=drama&page=2')
  })

  it('is null for a search, any other filter, several genres or another sort', () => {
    expect(canonical({ q: 'dune' })).toBeNull()
    expect(canonical({ person: 'denis-villeneuve' })).toBeNull()
    expect(canonical({ genres: 'drama', yearFrom: '2000' })).toBeNull()
    expect(canonical({ runtimeMax: '90' })).toBeNull()
    expect(canonical({ genres: 'drama,horror' })).toBeNull()
    expect(canonical({ sort: 'title' })).toBeNull()
  })

  it('ignores what the list ignores: a garbled parameter falls back to its default', () => {
    expect(canonical({ sort: 'garbage', page: 'x' })).toBe('/movies')
  })
})

describe('describeMovie', () => {
  it('is the synopsis when there is one', () => {
    expect(describeMovie(movie({ synopsis: 'A linguist is recruited.' }))).toBe(
      'A linguist is recruited.',
    )
  })

  it('falls back to the title, year and directors', () => {
    expect(
      describeMovie(
        movie({ credits: { directors: [person('Denis Villeneuve')], writers: [], cast: [] } }),
      ),
    ).toBe('Arrival (2016), directed by Denis Villeneuve. Cast, credits, ratings and reviews.')
    expect(describeMovie(movie())).toBe('Arrival (2016). Cast, credits, ratings and reviews.')
  })
})

describe('describePerson', () => {
  it('is the bio when there is one', () => {
    expect(describePerson(personDetail({ bio: 'A Canadian filmmaker.' }))).toBe(
      'A Canadian filmmaker.',
    )
  })

  it('falls back to their credits and latest films', () => {
    expect(
      describePerson(
        personDetail({
          filmography: [
            credit('Dune', ['DIRECTOR', 'WRITER']),
            credit('Arrival', ['DIRECTOR']),
            credit('Sicario', ['DIRECTOR']),
            credit('Enemy', ['DIRECTOR']),
          ],
        }),
      ),
    ).toBe('Denis Villeneuve: Directed 4 · Wrote 1. Films include Dune, Arrival, and Sicario.')
  })

  it('names the site for someone without credits', () => {
    expect(describePerson(personDetail())).toBe(`Denis Villeneuve on ${env.appName}.`)
  })
})

describe('describeReview', () => {
  it('gives the rating and the start of the text', () => {
    expect(describeReview(review({ body: 'Quietly devastating.' }))).toBe(
      'Ada rated Arrival (2016) 4.5 out of 5: Quietly devastating.',
    )
  })

  it('gives the rating alone without text', () => {
    expect(describeReview(review())).toBe('Ada rated Arrival (2016) 4.5 out of 5.')
  })

  it('never shows the text of a spoiler review', () => {
    expect(describeReview(review({ body: 'The future is the past.', spoiler: true }))).toBe(
      'Ada rated Arrival (2016) 4.5 out of 5.',
    )
  })
})
