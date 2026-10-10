import { describe, expect, it } from 'vitest'
import type { MovieDetail } from '@/lib/dto/movies'
import type { PersonDetail } from '@/lib/dto/people'
import type { ReviewDetail } from '@/lib/dto/reviews'
import { env } from '@/lib/env'
import { movieJsonLd, personJsonLd, reviewJsonLd, websiteJsonLd } from '@/lib/structuredData'

const ORIGIN = new URL('https://films.example')

const person = (name: string, slug: string) => ({ id: slug, slug, name, headshotUrl: null })

const arrival: MovieDetail = {
  id: 'm1',
  slug: 'arrival-2016',
  title: 'Arrival',
  releaseDate: new Date('2016-11-11T00:00:00.000Z'),
  runtimeMinutes: 116,
  posterUrl: 'https://cdn.example/arrival.jpg',
  genres: [{ id: 'g1', name: 'Drama', slug: 'drama' }],
  synopsis: 'A linguist is recruited.',
  createdBy: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  credits: {
    directors: [person('Denis Villeneuve', 'denis-villeneuve')],
    writers: [person('Eric Heisserer', 'eric-heisserer')],
    cast: [{ ...person('Amy Adams', 'amy-adams'), star: true }],
  },
  permissions: { update: false, delete: false },
}

describe('websiteJsonLd', () => {
  it('names the site at its origin', () => {
    expect(websiteJsonLd(ORIGIN)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: env.appName,
      url: 'https://films.example/',
    })
  })
})

describe('movieJsonLd', () => {
  it('describes the movie with its credits linked to their pages and its rating', () => {
    expect(movieJsonLd(arrival, { average: 4.3, count: 12 }, ORIGIN)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Movie',
      name: 'Arrival',
      url: 'https://films.example/movies/arrival-2016',
      dateCreated: '2016-11-11',
      description: 'A linguist is recruited.',
      image: 'https://cdn.example/arrival.jpg',
      duration: 'PT116M',
      genre: ['Drama'],
      director: [
        {
          '@type': 'Person',
          name: 'Denis Villeneuve',
          url: 'https://films.example/people/denis-villeneuve',
        },
      ],
      author: [
        {
          '@type': 'Person',
          name: 'Eric Heisserer',
          url: 'https://films.example/people/eric-heisserer',
        },
      ],
      actor: [
        { '@type': 'Person', name: 'Amy Adams', url: 'https://films.example/people/amy-adams' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 4.3,
        ratingCount: 12,
        bestRating: 5,
        worstRating: 0.5,
      },
    })
  })

  it('leaves out what the movie does not have', () => {
    const data = movieJsonLd(
      { ...arrival, synopsis: null, posterUrl: null, runtimeMinutes: null },
      { average: null, count: 0 },
      ORIGIN,
    )
    expect(data).not.toHaveProperty('description')
    expect(data).not.toHaveProperty('image')
    expect(data).not.toHaveProperty('duration')
    expect(data).not.toHaveProperty('aggregateRating')
  })
})

describe('personJsonLd', () => {
  const base: PersonDetail = {
    ...person('Agnès Varda', 'agnes-varda'),
    bio: null,
    birthDate: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    filmography: [],
    permissions: { update: false, delete: false },
  }

  it('describes the person with whatever the catalog has', () => {
    expect(
      personJsonLd(
        {
          ...base,
          headshotUrl: 'https://cdn.example/varda.jpg',
          bio: 'A Belgian-born filmmaker.',
          birthDate: new Date('1928-05-30T00:00:00.000Z'),
        },
        ORIGIN,
      ),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Agnès Varda',
      url: 'https://films.example/people/agnes-varda',
      image: 'https://cdn.example/varda.jpg',
      description: 'A Belgian-born filmmaker.',
      birthDate: '1928-05-30',
    })
  })

  it('is the name and page alone without the rest', () => {
    expect(personJsonLd(base, ORIGIN)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Agnès Varda',
      url: 'https://films.example/people/agnes-varda',
    })
  })
})

describe('reviewJsonLd', () => {
  const review: ReviewDetail = {
    id: '5f0c1c62-4f0e-4a43-9a8e-0f6a2b1e9a11',
    movieId: 'm1',
    rating: 4.5,
    body: 'Quietly devastating.',
    spoiler: false,
    createdAt: new Date('2026-02-01T10:00:00.000Z'),
    updatedAt: new Date('2026-02-01T10:00:00.000Z'),
    commentCount: 0,
    author: { id: 'u1', name: 'Ada', username: 'ada' },
    permissions: { update: false, delete: false },
    movie: {
      id: 'm1',
      slug: 'arrival-2016',
      title: 'Arrival',
      releaseDate: new Date('2016-11-11T00:00:00.000Z'),
      posterUrl: null,
    },
  }

  it('rates the movie it reviews, with the text', () => {
    expect(reviewJsonLd(review, ORIGIN)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Review',
      url: `https://films.example/movies/arrival-2016/reviews/${review.id}`,
      itemReviewed: {
        '@type': 'Movie',
        name: 'Arrival',
        url: 'https://films.example/movies/arrival-2016',
        dateCreated: '2016-11-11',
      },
      author: { '@type': 'Person', name: 'Ada' },
      reviewRating: { '@type': 'Rating', ratingValue: 4.5, bestRating: 5, worstRating: 0.5 },
      datePublished: '2026-02-01T10:00:00.000Z',
      reviewBody: 'Quietly devastating.',
    })
  })

  it('leaves out the text of a spoiler review', () => {
    expect(reviewJsonLd({ ...review, spoiler: true }, ORIGIN)).not.toHaveProperty('reviewBody')
  })
})
