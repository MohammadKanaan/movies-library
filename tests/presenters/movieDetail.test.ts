import { describe, expect, it } from 'vitest'
import type { CastMember, MovieDetail } from '@/lib/dto/movies'
import type { PersonSummary } from '@/lib/dto/people'
import { presentMovieDetail } from '@/presenters/movieDetail'

const people = (prefix: string, count: number): PersonSummary[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    slug: `${prefix}-${index + 1}`,
    name: `${prefix} ${index + 1}`,
    headshotUrl: null,
  }))

/** The cast in billing order, starring the members at `stars` (zero-based). */
const castOf = (count: number, stars: number[]): CastMember[] =>
  people('cast', count).map((person, index) => ({ ...person, star: stars.includes(index) }))

const movieWith = (credits: MovieDetail['credits']): MovieDetail => ({
  id: '44444444-4444-4444-8444-444444444444',
  slug: 'dune-2021',
  title: 'Dune',
  synopsis: null,
  releaseDate: new Date('2021-10-22T00:00:00.000Z'),
  runtimeMinutes: 155,
  posterUrl: null,
  genres: [],
  rating: { average: null, count: 0 },
  credits,
  createdBy: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  permissions: { update: false, delete: false },
})

describe('presentMovieDetail', () => {
  it('bills the starred cast, the top two writers and every director', () => {
    const movie = movieWith({
      directors: people('director', 2),
      writers: people('writer', 3),
      cast: castOf(5, [0, 3]),
    })

    const presented = presentMovieDetail(movie)

    expect(presented.starring.map((member) => member.name)).toEqual(['cast 1', 'cast 4'])
    expect(presented.writtenBy.map((person) => person.name)).toEqual(['writer 1', 'writer 2'])
    expect(presented.credits.directors).toHaveLength(2)
  })

  it('puts everyone after the leads on the rail, cast first, labelled by role and billing', () => {
    const movie = movieWith({
      directors: people('director', 1),
      writers: people('writer', 3),
      cast: castOf(5, [0, 2]),
    })
    const [, second, , fourth, fifth] = people('cast', 5)

    expect(presentMovieDetail(movie).supporting).toEqual([
      { person: second, role: 'cast', label: 'Cast · #2' },
      { person: fourth, role: 'cast', label: 'Cast · #4' },
      { person: fifth, role: 'cast', label: 'Cast · #5' },
      { person: movie.credits.writers[2], role: 'writer', label: 'Writer' },
    ])
  })

  it('stars no one when no cast member is starred', () => {
    const movie = movieWith({ directors: [], writers: [], cast: castOf(2, []) })

    const presented = presentMovieDetail(movie)

    expect(presented.starring).toEqual([])
    expect(presented.supporting.map(({ label }) => label)).toEqual(['Cast · #1', 'Cast · #2'])
  })

  it('leaves the rail empty when the leads are everyone', () => {
    const movie = movieWith({
      directors: [],
      writers: people('writer', 2),
      cast: castOf(3, [0, 1, 2]),
    })

    expect(presentMovieDetail(movie).supporting).toEqual([])
  })

  it('reads the release year in UTC', () => {
    const movie = movieWith({ directors: [], writers: [], cast: [] })

    const presented = presentMovieDetail({
      ...movie,
      releaseDate: new Date('2021-01-01T00:00:00.000Z'),
    })

    expect(presented.year).toBe(2021)
  })
})
