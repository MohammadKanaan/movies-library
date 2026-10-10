import { ROUTE_MOVIES } from '@/lib/constants-routes'
import { summarizeFilmography } from '@/lib/creditRoles'
import { hasMovieFilters, type MovieDetail, type MoviesUrlQuery } from '@/lib/dto/movies'
import type { PersonDetail } from '@/lib/dto/people'
import type { ReviewDetail } from '@/lib/dto/reviews'
import { env } from '@/lib/env'

/** Search results show about this many characters of a description and cut the rest. */
export const META_DESCRIPTION_MAX_LENGTH = 160

/** The site's description: the home page's and every page's that has none of its own. */
export const SITE_DESCRIPTION =
  'Browse films and the people who make them, and read what viewers think of them.'

/**
 * The Open Graph fields every page shares. A page that sets `openGraph` replaces the root
 * layout's object rather than merging into it, so it spreads these first.
 */
export const SITE_OPEN_GRAPH = { siteName: env.appName, locale: 'en_US' } as const

/** Out of search results, links still followed: private, transient and near-duplicate views. */
export const NO_INDEX = { index: false, follow: true } as const

/** How many film titles a person's fallback description names, newest first. */
const FILM_TITLES = 3

const listFormat = new Intl.ListFormat('en', { type: 'conjunction' })

/**
 * Text as a meta description: whitespace collapsed to single spaces, and when too long, cut at
 * the last whole word that fits and closed with an ellipsis.
 */
export const metaDescription = (text: string, max = META_DESCRIPTION_MAX_LENGTH): string => {
  const flat = text.replace(/\s+/g, ' ').trim()
  if (flat.length <= max) {
    return flat
  }
  const cut = flat.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  const words = lastSpace > 0 ? cut.slice(0, lastSpace) : cut
  return `${words.replace(/[\s,;:.!?–—-]+$/, '')}…`
}

/** A paged list's title: the first page is the list's own, later pages say which they are. */
export const pagedTitle = (title: string, page: number): string =>
  page > 1 ? `${title} · Page ${page}` : title

/** A paged list's URL: the first page carries no `page` parameter, as the list's links write it. */
export const pagedPath = (path: string, page: number): string =>
  page > 1 ? `${path}?${new URLSearchParams({ page: String(page) })}` : path

/**
 * The canonical path of a movie list view, or null when it stays out of search results. The whole
 * catalog and a single genre are landing pages, page by page. A title search, any other filter or
 * another sort shows the same films as one of those (and the combinations are unbounded), so it is
 * not indexed.
 */
export const moviesCanonicalPath = ({ genres, page, sort, ...filters }: MoviesUrlQuery) => {
  if (sort !== 'newest' || genres.length > 1 || hasMovieFilters({ ...filters, genres: [] })) {
    return null
  }
  const params = new URLSearchParams()
  if (genres.length === 1) {
    params.set('genres', genres[0])
  }
  if (page > 1) {
    params.set('page', String(page))
  }
  const query = params.toString()
  return query ? `${ROUTE_MOVIES}?${query}` : ROUTE_MOVIES
}

/** A movie's description: its synopsis, or the title, year and directors when it has none. */
export const describeMovie = (movie: MovieDetail): string => {
  if (movie.synopsis) {
    return metaDescription(movie.synopsis)
  }
  const directors = movie.credits.directors.map((person) => person.name)
  const directed = directors.length > 0 ? `, directed by ${listFormat.format(directors)}` : ''
  return metaDescription(
    `${movie.title} (${movie.releaseDate.getUTCFullYear()})${directed}. Cast, credits, ratings and reviews.`,
  )
}

/**
 * A person's description: their bio, or their credits and the first of `films` (the page of their
 * filmography being shown) when they have none.
 */
export const describePerson = (person: PersonDetail, films: { title: string }[]): string => {
  if (person.bio) {
    return metaDescription(person.bio)
  }
  const summary = summarizeFilmography(person.roleCounts)
  if (!summary) {
    return `${person.name} on ${env.appName}.`
  }
  const titles = films.slice(0, FILM_TITLES).map((movie) => movie.title)
  return metaDescription(`${person.name}: ${summary}. Films include ${listFormat.format(titles)}.`)
}

/**
 * A review's description: who rated which movie how, and the start of the text. A spoiler review's
 * text is hidden on the page until asked for, so it is never in the description.
 */
export const describeReview = (review: ReviewDetail): string => {
  const { author, movie, rating } = review
  const rated = `${author.name} rated ${movie.title} (${movie.releaseDate.getUTCFullYear()}) ${rating} out of 5`
  return metaDescription(review.body && !review.spoiler ? `${rated}: ${review.body}` : `${rated}.`)
}
