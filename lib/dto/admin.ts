import { z } from 'zod'
import { movieSummarySchema } from './movies'
import { adminUserSchema } from './users'

/** One of a user's sessions as the admin sees it. Never the token: it is the credential. */
export const adminSessionSchema = z.object({
  id: z.string(),
  userAgent: z.string().nullable(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
})

export type AdminSession = z.infer<typeof adminSessionSchema>

/** The admin's view of one user: the list row plus their image, active sessions and the movies they added. */
export const adminUserDetailSchema = adminUserSchema.extend({
  image: z.string().nullable(),
  updatedAt: z.coerce.date(),
  sessions: z.array(adminSessionSchema),
  movieCount: z.number().int(),
  /** The newest movies they added (at most `ADMIN_USER_MOVIES`). */
  movies: z.array(movieSummarySchema),
})

export type AdminUserDetail = z.infer<typeof adminUserDetailSchema>

/** How many of a user's movies the detail carries. */
export const ADMIN_USER_MOVIES = 10
/** How many recent rows the overview carries. */
export const ADMIN_OVERVIEW_RECENT = 5

const count = z.number().int().nonnegative()

/** The dashboard's front page: counts and what was added last. Admin only, never cached. */
export const adminOverviewSchema = z.object({
  counts: z.object({
    movies: count,
    people: count,
    genres: count,
    users: count,
    admins: count,
    banned: count,
    moviesWithoutPoster: count,
  }),
  recentMovies: z.array(movieSummarySchema),
  recentUsers: z.array(adminUserSchema),
})

export type AdminOverview = z.infer<typeof adminOverviewSchema>
