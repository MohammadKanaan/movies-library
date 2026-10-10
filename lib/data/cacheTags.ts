import 'server-only'

/** Cache tags for `remember()` / `invalidateTags()`. Writes invalidate them inside the DAL. */
export const userTag = (id: string) => `user:${id}`

/**
 * Every cached catalog read (movie lists and details, genres, people) carries this one tag and every
 * catalog write invalidates it. Movies, genres and people reference each other (credits, filmographies,
 * genre counts), so per-record tags would need a fan-out on each write for data that changes rarely;
 * one tag is correct by construction.
 */
export const CATALOG_TAG = 'catalog'

/**
 * Every cached read that shows many movies' ratings (movie lists, filmographies) carries this tag as
 * well, and every review write invalidates it, as does deleting a user (their reviews cascade). It is
 * not `CATALOG_TAG`: a review changes ratings, not genres or people. One tag rather than one per
 * movie, because a list sorted by rating changes when any movie's rating does. A movie's own page
 * does not carry it: `getMovieBySlug` reads the rating beside its cached record.
 */
export const RATINGS_TAG = 'ratings'
