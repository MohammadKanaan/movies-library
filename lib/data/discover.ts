import 'server-only'
import { z } from 'zod'
import { Prisma } from '@/generated/prisma/client'
import { DAY, MINUTE } from '@/lib/constants-time'
import { FAN_FAVORITE_MIN_RATINGS } from '@/lib/dto/discover'
import type { MovieSummary } from '@/lib/dto/movies'
import type { PersonListItem } from '@/lib/dto/people'
import { remember } from '@/lib/server/cache'
import { db } from './db'
import { inOrder } from './inOrder'
import { movieSummarySelect, toMovieSummary } from './movieSummary'
import { personListItemSelect, toPersonListItem } from './people'

// The home page's shelves, public and the same for every viewer. Trending is ranked from what the
// community does: reviews and comments are the only engagement the database records (no views,
// watchlists or favourites). Fan favorites rank on the rating columns the reviews trigger keeps.
//
// Each shelf is ranked in SQL (Prisma cannot order by an expression) to a list of ids, and only the
// ids are cached, for a TTL and under no tag: a ranking may lag that long, where invalidating it on
// every review would leave a busy site without cache hits. The cards are then read fresh by id (a
// primary-key lookup), so a rating, a rename or a deletion shows at once.

/** How many items a shelf holds. */
const SHELF_SIZE = 12
/** Fan favorites is an accordion of panels side by side: past eight, the closed ones get too thin. */
const FAN_FAVORITES_SIZE = 8

/** Trending counts activity in this window, the newest the most. */
const TRENDING_WINDOW_SECONDS = 7 * DAY
/** Activity this old counts half as much as activity now. */
const TRENDING_HALF_LIFE_SECONDS = 2 * DAY
/** A review takes more effort than a comment, so it says more about a movie's pull. */
const REVIEW_WEIGHT = 3
const COMMENT_WEIGHT = 1
/** A credit headlines a movie when it directs it, stars in it or is among the first cast billed. */
const TOP_BILLED = 3
/** How much any other credit counts toward a person's trend, against a headlining one. */
const SUPPORTING_WEIGHT = 0.25

/** Long enough to spare the activity scan on most visits, short enough that "this week" stays current. */
const TRENDING_CACHE_TTL = 15 * MINUTE
/** A ranking over every rating moves slowly. */
const FAN_FAVORITES_CACHE_TTL = 60 * MINUTE

const idsSchema = z.array(z.uuid())
const idRowsSchema = z.array(z.object({ id: z.uuid() }))

const rankedIds = async (query: Prisma.Sql) => {
  const rows = await db.$queryRaw(query)
  return idRowsSchema.parse(rows).map((row) => row.id)
}

/**
 * Per movie with any review or comment: `recent`, its activity inside the window with each event's
 * weight halved every half-life, and `total`, its weighted activity of all time. Ranking by `recent`
 * then `total` keeps a shelf full in a quiet week: the most discussed movies fill it.
 */
const movieScores = Prisma.sql`
  activity AS (
    SELECT movie_id, created_at, ${REVIEW_WEIGHT}::float8 AS weight FROM reviews
    UNION ALL
    SELECT reviews.movie_id, review_comments.created_at, ${COMMENT_WEIGHT}::float8
    FROM review_comments JOIN reviews ON reviews.id = review_comments.review_id
  ),
  movie_scores AS (
    SELECT movie_id,
      COALESCE(
        SUM(weight * power(0.5, EXTRACT(EPOCH FROM now() - created_at)::float8
          / ${TRENDING_HALF_LIFE_SECONDS}::float8))
          FILTER (WHERE created_at > now() - make_interval(secs => ${TRENDING_WINDOW_SECONDS})),
        0
      ) AS recent,
      SUM(weight) AS total
    FROM activity
    GROUP BY movie_id
  )`

const trendingMovieIds = () =>
  rankedIds(Prisma.sql`
    WITH ${movieScores}
    SELECT movie_id AS id FROM movie_scores
    ORDER BY recent DESC, total DESC, movie_id DESC
    LIMIT ${SHELF_SIZE}`)

/**
 * A person scores the trend of each movie they are credited on, once per movie (a writer-director
 * counts it once, at their best weight): in full where they headline it, a quarter otherwise.
 */
const trendingPersonIds = () =>
  rankedIds(Prisma.sql`
    WITH ${movieScores},
    person_movies AS (
      SELECT person_id, movie_id,
        MAX(CASE
          WHEN role = 'DIRECTOR' OR star OR (role = 'ACTOR' AND position < ${TOP_BILLED}) THEN 1
          ELSE ${SUPPORTING_WEIGHT}::float8
        END) AS weight
      FROM credits
      GROUP BY person_id, movie_id
    )
    SELECT person_movies.person_id AS id
    FROM person_movies JOIN movie_scores ON movie_scores.movie_id = person_movies.movie_id
    GROUP BY person_movies.person_id
    ORDER BY SUM(person_movies.weight * movie_scores.recent) DESC,
      SUM(person_movies.weight * movie_scores.total) DESC,
      person_movies.person_id ASC
    LIMIT ${SHELF_SIZE}`)

/**
 * Movies with enough ratings, best first by IMDb's weighted mean: the movie's own mean pulled toward
 * the site-wide mean by `FAN_FAVORITE_MIN_RATINGS` ratings' worth, so three 5★ ratings do not
 * outrank two hundred averaging 4.8. Both means are in half stars, from the trigger's columns.
 */
const fanFavoriteIds = () =>
  rankedIds(Prisma.sql`
    WITH overall AS (
      SELECT SUM(rating_total)::float8 / NULLIF(SUM(rating_count), 0) AS mean FROM movies
    )
    SELECT id FROM movies CROSS JOIN overall
    WHERE rating_count >= ${FAN_FAVORITE_MIN_RATINGS}::int
    ORDER BY (rating_total + ${FAN_FAVORITE_MIN_RATINGS}::int * overall.mean)
        / (rating_count + ${FAN_FAVORITE_MIN_RATINGS}::int) DESC,
      rating_count DESC,
      id DESC
    LIMIT ${FAN_FAVORITES_SIZE}`)

const cachedIds = (key: string, ttl: number, rank: () => Promise<string[]>) =>
  remember(`discover:${key}`, { ttl, tags: [], schema: idsSchema }, rank)

const movieSummariesInOrder = async (ids: string[]): Promise<MovieSummary[]> => {
  const rows = await db.movie.findMany({ where: { id: { in: ids } }, select: movieSummarySelect })
  return inOrder(ids, rows.map(toMovieSummary))
}

/** Public: the movies drawing the most reviews and comments this week, most first. */
export const getTrendingMovies = async (): Promise<MovieSummary[]> => {
  const ids = await cachedIds('trending-movies', TRENDING_CACHE_TTL, trendingMovieIds)
  return movieSummariesInOrder(ids)
}

/** Public: the people credited on the trending movies, those who headline them first. */
export const getTrendingPeople = async (): Promise<PersonListItem[]> => {
  const ids = await cachedIds('trending-people', TRENDING_CACHE_TTL, trendingPersonIds)
  const rows = await db.person.findMany({
    where: { id: { in: ids } },
    select: personListItemSelect,
  })
  return inOrder(ids, rows.map(toPersonListItem))
}

/** Public: the best-rated movies with at least `FAN_FAVORITE_MIN_RATINGS` ratings. */
export const getFanFavorites = async (): Promise<MovieSummary[]> => {
  const ids = await cachedIds(
    `fan-favorites:${FAN_FAVORITES_SIZE}`,
    FAN_FAVORITES_CACHE_TTL,
    fanFavoriteIds,
  )
  return movieSummariesInOrder(ids)
}
