import 'server-only'
import { APIError } from 'better-auth/api'
import { headers } from 'next/headers'
import { Prisma } from '@/generated/prisma/client'
import {
  ADMIN_OVERVIEW_RECENT,
  ADMIN_USER_MOVIES,
  type AdminOverview,
  type AdminUserDetail,
} from '@/lib/dto/admin'
import { toPage, type Page } from '@/lib/dto/common'
import {
  banUserInput,
  listUsersQuery,
  setUserRoleInput,
  userIdSchema,
  type AdminUser,
  type BanUserInput,
  type ListUsersQuery,
  type SetUserRoleInput,
} from '@/lib/dto/users'
import { auth, requireAdmin, requireUser, toRole } from './auth'
import { db } from './db'
import { escapeLike } from './escapeLike'
import { ForbiddenError, NotFoundError, parseInput } from './errors'
import { movieSummarySelect, toMovieSummary } from './movieSummary'

// The admin area. Reads are this app's own queries; writes go through Better Auth's admin plugin
// (`auth.api.*`), which owns the semantics (a ban revokes the sessions, impersonation opens a
// session that remembers the admin). Both run behind `requireAdmin()`, and the plugin's HTTP
// routes are closed (`disabledPaths` in `./auth`), so this file is the one way in.

const adminUserSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  emailVerified: true,
  role: true,
  banned: true,
  banReason: true,
  createdAt: true,
} satisfies Prisma.UserSelect

/**
 * Maps the plugin's failures onto the DAL's errors: a missing user is 404; refusing to act on the
 * admin's own account, or on another admin, is 403. Anything else is a bug and propagates.
 */
const fromAdminApi = (error: unknown): never => {
  if (error instanceof APIError) {
    if (error.body?.code === 'USER_NOT_FOUND') {
      throw new NotFoundError('User not found')
    }
    if (error.status === 'FORBIDDEN' || error.status === 'BAD_REQUEST') {
      throw new ForbiddenError(error.body?.message)
    }
  }
  throw error
}

type AdminUserRow = Prisma.UserGetPayload<{ select: typeof adminUserSelect }>

const toAdminUser = (row: AdminUserRow): AdminUser => ({ ...row, role: toRole(row.role) })

/** The admin user DTO of one row, fresh from the database (the plugin's own output is untyped). */
const readAdminUser = async (id: string): Promise<AdminUser> => {
  const row = await db.user.findUnique({ where: { id }, select: adminUserSelect })
  if (!row) {
    throw new NotFoundError('User not found')
  }
  return toAdminUser(row)
}

/**
 * Admin only: every user, newest first, optionally filtered by a search over name, username and
 * email, by role and by status. Never cached: the list carries emails and is restricted to admins,
 * and a shared cache entry would outlive a role change.
 */
export const listUsers = async (query: ListUsersQuery): Promise<Page<AdminUser>> => {
  await requireAdmin()
  const { page, perPage, q, role, status } = parseInput(listUsersQuery, query)
  const contains = q ? { contains: escapeLike(q), mode: 'insensitive' as const } : undefined
  const where: Prisma.UserWhereInput = {
    ...(contains ? { OR: [{ name: contains }, { username: contains }, { email: contains }] } : {}),
    ...(role ? { role } : {}),
    ...(status ? { banned: status === 'banned' } : {}),
  }
  const [rows, totalItems] = await Promise.all([
    db.user.findMany({
      where,
      select: adminUserSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.user.count({ where }),
  ])
  return toPage(rows.map(toAdminUser), totalItems, { page, perPage })
}

/** The detail's row: the list row plus image, timestamps, live sessions (never the token) and the movie count. */
const adminUserDetailSelect = (now: Date) =>
  ({
    ...adminUserSelect,
    image: true,
    updatedAt: true,
    sessions: {
      where: { expiresAt: { gt: now } },
      select: { id: true, userAgent: true, createdAt: true, expiresAt: true },
      orderBy: { createdAt: 'desc' },
    },
    _count: { select: { movies: true } },
  }) satisfies Prisma.UserSelect

/**
 * Admin only: one user with their image, unexpired sessions and the newest movies they added. A
 * malformed id reads as not found, like an unknown one (it is a read, so pages pass the route
 * param straight in). Never cached, like the list.
 */
export const getAdminUser = async (id: string): Promise<AdminUserDetail> => {
  await requireAdmin()
  if (!userIdSchema.safeParse(id).success) {
    throw new NotFoundError('User not found')
  }
  const [row, movies] = await Promise.all([
    db.user.findUnique({ where: { id }, select: adminUserDetailSelect(new Date()) }),
    db.movie.findMany({
      where: { createdById: id },
      select: movieSummarySelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: ADMIN_USER_MOVIES,
    }),
  ])
  if (!row) {
    throw new NotFoundError('User not found')
  }
  const { _count, sessions, ...user } = row
  return {
    ...toAdminUser(user),
    image: user.image,
    updatedAt: user.updatedAt,
    sessions,
    movieCount: _count.movies,
    movies: movies.map(toMovieSummary),
  }
}

/**
 * Admin only: ends every session of the user (they are signed out everywhere, and may sign in
 * again). The plugin does not check that the user exists, so the DAL does (404).
 */
export const revokeUserSessions = async (id: string): Promise<void> => {
  await requireAdmin()
  const userId = parseInput(userIdSchema, id)
  await readAdminUser(userId)
  await auth.api
    .revokeUserSessions({ body: { userId }, headers: await headers() })
    .catch(fromAdminApi)
}

/** Admin only: the dashboard's counts and the latest additions. Never cached: a few indexed counts. */
export const getAdminOverview = async (): Promise<AdminOverview> => {
  await requireAdmin()
  const [
    movies,
    people,
    genres,
    users,
    admins,
    banned,
    moviesWithoutPoster,
    recentMovies,
    recentUsers,
  ] = await Promise.all([
    db.movie.count(),
    db.person.count(),
    db.genre.count(),
    db.user.count(),
    db.user.count({ where: { role: 'admin' } }),
    db.user.count({ where: { banned: true } }),
    db.movie.count({ where: { posterUrl: null } }),
    db.movie.findMany({
      select: movieSummarySelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: ADMIN_OVERVIEW_RECENT,
    }),
    db.user.findMany({
      select: adminUserSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      take: ADMIN_OVERVIEW_RECENT,
    }),
  ])
  return {
    counts: { movies, people, genres, users, admins, banned, moviesWithoutPoster },
    recentMovies: recentMovies.map(toMovieSummary),
    recentUsers: recentUsers.map(toAdminUser),
  }
}

/**
 * Admin only, in this order: admin (401/403) → input valid (422) → not the admin's own account
 * (403, so the last admin cannot demote themselves) → the user exists (404). Roles are read from
 * the database session on every request, so the change applies on the target's next request.
 */
export const setUserRole = async (input: SetUserRoleInput): Promise<AdminUser> => {
  const viewer = await requireAdmin()
  const { id, role } = parseInput(setUserRoleInput, input)
  if (id === viewer.id) {
    throw new ForbiddenError('You cannot change your own role')
  }
  await auth.api
    .setRole({ body: { userId: id, role }, headers: await headers() })
    .catch(fromAdminApi)
  return readAdminUser(id)
}

/**
 * Admin only: bans a user. Better Auth deletes their sessions and refuses their sign-ins with the
 * reason until `unbanUser`. The plugin checks that the user exists (404) and then refuses the
 * admin's own account (403).
 */
export const banUser = async (input: BanUserInput): Promise<AdminUser> => {
  await requireAdmin()
  const { id, reason } = parseInput(banUserInput, input)
  await auth.api
    .banUser({ body: { userId: id, banReason: reason || undefined }, headers: await headers() })
    .catch(fromAdminApi)
  return readAdminUser(id)
}

export const unbanUser = async (id: string): Promise<AdminUser> => {
  await requireAdmin()
  const userId = parseInput(userIdSchema, id)
  await auth.api.unbanUser({ body: { userId }, headers: await headers() }).catch(fromAdminApi)
  return readAdminUser(userId)
}

/**
 * Admin only: signs this browser in as `id` for an hour, keeping the admin's own session aside so
 * `stopImpersonating` can restore it. The plugin refuses other admins (403). The new session
 * carries `impersonatedBy`, which `getSessionUser` exposes and the layout shows as a banner.
 */
export const impersonateUser = async (id: string): Promise<void> => {
  await requireAdmin()
  const userId = parseInput(userIdSchema, id)
  await auth.api.impersonateUser({ body: { userId }, headers: await headers() }).catch(fromAdminApi)
}

/** Signed in (401) → ends an impersonation and restores the admin's session; a plain session answers 403. */
export const stopImpersonating = async (): Promise<void> => {
  await requireUser()
  await auth.api.stopImpersonating({ headers: await headers() }).catch((error: unknown) => {
    if (error instanceof APIError && error.status === 'BAD_REQUEST') {
      throw new ForbiddenError('You are not impersonating anyone')
    }
    throw error
  })
}
