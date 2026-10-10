import type { Movie, Person, Review, WebSite, WithContext } from 'schema-dts'
import { moviePath, personPath, reviewPath, ROUTE_HOME } from '@/lib/constants-routes'
import type { MovieDetail } from '@/lib/dto/movies'
import type { PersonDetail, PersonSummary } from '@/lib/dto/people'
import { RATING_MAX, RATING_MIN, type RatingSummary, type ReviewDetail } from '@/lib/dto/reviews'
import { env } from '@/lib/env'

// schema.org JSON-LD for the public pages (rendered by `components/JsonLd`), in the shape Google's
// Movie and review snippet docs ask for. Every URL is absolute, on the origin the page passes in
// (`siteUrl()`), because structured data has no `metadataBase` to resolve a path against.

const absolute = (path: string, origin: URL) => new URL(path, origin).toString()

const calendarDay = (date: Date) => date.toISOString().slice(0, 10)

const personReference = (person: PersonSummary, origin: URL): Person => ({
  '@type': 'Person',
  name: person.name,
  url: absolute(personPath(person.slug), origin),
})

/** The site itself, on the home page: how search engines learn its name. */
export const websiteJsonLd = (origin: URL): WithContext<WebSite> => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: env.appName,
  url: absolute(ROUTE_HOME, origin),
})

/** A movie with its credits, linked to each person's page, and its rating once it has one. */
export const movieJsonLd = (
  movie: MovieDetail,
  rating: RatingSummary,
  origin: URL,
): WithContext<Movie> => ({
  '@context': 'https://schema.org',
  '@type': 'Movie',
  name: movie.title,
  url: absolute(moviePath(movie.slug), origin),
  // Google reads a movie's release date from `dateCreated`.
  dateCreated: calendarDay(movie.releaseDate),
  ...(movie.synopsis ? { description: movie.synopsis } : {}),
  ...(movie.posterUrl ? { image: movie.posterUrl } : {}),
  ...(movie.runtimeMinutes === null ? {} : { duration: `PT${movie.runtimeMinutes}M` }),
  genre: movie.genres.map((genre) => genre.name),
  director: movie.credits.directors.map((person) => personReference(person, origin)),
  author: movie.credits.writers.map((person) => personReference(person, origin)),
  actor: movie.credits.cast.map((person) => personReference(person, origin)),
  ...(rating.average === null
    ? {}
    : {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: rating.average,
          ratingCount: rating.count,
          bestRating: RATING_MAX,
          worstRating: RATING_MIN,
        },
      }),
})

/** A person with their photo, bio and birth date, whichever the catalog has. */
export const personJsonLd = (person: PersonDetail, origin: URL): WithContext<Person> => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: person.name,
  url: absolute(personPath(person.slug), origin),
  ...(person.headshotUrl ? { image: person.headshotUrl } : {}),
  ...(person.bio ? { description: person.bio } : {}),
  ...(person.birthDate ? { birthDate: calendarDay(person.birthDate) } : {}),
})

/**
 * One viewer's review of a movie. A spoiler review's text is folded away on the page, so it is left
 * out here too, where a search result could show it.
 */
export const reviewJsonLd = (review: ReviewDetail, origin: URL): WithContext<Review> => ({
  '@context': 'https://schema.org',
  '@type': 'Review',
  url: absolute(reviewPath(review.movie.slug, review.id), origin),
  itemReviewed: {
    '@type': 'Movie',
    name: review.movie.title,
    url: absolute(moviePath(review.movie.slug), origin),
    dateCreated: calendarDay(review.movie.releaseDate),
    ...(review.movie.posterUrl ? { image: review.movie.posterUrl } : {}),
  },
  author: { '@type': 'Person', name: review.author.name },
  reviewRating: {
    '@type': 'Rating',
    ratingValue: review.rating,
    bestRating: RATING_MAX,
    worstRating: RATING_MIN,
  },
  datePublished: review.createdAt.toISOString(),
  ...(review.body && !review.spoiler ? { reviewBody: review.body } : {}),
})
