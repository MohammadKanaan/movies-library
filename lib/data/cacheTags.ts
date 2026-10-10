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
 * A movie's review reads (its rating summary) carry this tag and every review write on that movie
 * invalidates it. It is not `CATALOG_TAG`: a review must not flush every cached movie list.
 */
export const reviewsTag = (movieId: string) => `reviews:${movieId}`
