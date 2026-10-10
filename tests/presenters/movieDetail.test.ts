import { describe, expect, it } from 'vitest'
import type { MovieDetail } from '@/lib/dto/movies'
import type { PersonSummary } from '@/lib/dto/people'
import { presentMovieDetail } from '@/presenters/movieDetail'

const people = (prefix: string, count: number): PersonSummary[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    slug: `${prefix}-${index + 1}`,
    name: `${prefix} ${index + 1}`,
  }))

const movieWith = (credits: MovieDetail['credits']): MovieDetail => ({
  id: '44444444-4444-4444-8444-444444444444',
  slug: 'dune-2021',
  title: 'Dune',
  synopsis: null,
  releaseDate: new Date('2021-10-22T00:00:00.000Z'),
  runtimeMinutes: 155,
  posterUrl: null,
  genres: [],
  credits,
  createdBy: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  permissions: { update: false, delete: false },
})

describe('presentMovieDetail', () => {
  it('bills the top three cast and top two writers, and every director', () => {
    const movie = movieWith({
      directors: people('director', 2),
      writers: people('writer', 3),
      cast: people('cast', 5),
    })

    const presented = presentMovieDetail(movie)

    expect(presented.starring.map((person) => person.name)).toEqual(['cast 1', 'cast 2', 'cast 3'])
    expect(presented.writtenBy.map((person) => person.name)).toEqual(['writer 1', 'writer 2'])
    expect(presented.credits.directors).toHaveLength(2)
  })

  it('puts everyone after the leads on the rail, cast first, labelled by role and billing', () => {
    const movie = movieWith({
      directors: people('director', 1),
      writers: people('writer', 3),
      cast: people('cast', 5),
    })

    expect(presentMovieDetail(movie).supporting).toEqual([
      { person: movie.credits.cast[3], role: 'cast', label: 'Cast · #4' },
      { person: movie.credits.cast[4], role: 'cast', label: 'Cast · #5' },
      { person: movie.credits.writers[2], role: 'writer', label: 'Writer' },
    ])
  })

  it('leaves the rail empty when the leads are everyone', () => {
    const movie = movieWith({
      directors: [],
      writers: people('writer', 2),
      cast: people('cast', 3),
    })

    expect(presentMovieDetail(movie).supporting).toEqual([])
  })

  it('reads the release year in UTC and keeps the DTO fields', () => {
    const movie = movieWith({ directors: [], writers: [], cast: [] })

    const presented = presentMovieDetail({
      ...movie,
      releaseDate: new Date('2021-01-01T00:00:00.000Z'),
    })

    expect(presented.year).toBe(2021)
    expect(presented.title).toBe('Dune')
    expect(presented.credits).toBe(movie.credits)
  })
})
