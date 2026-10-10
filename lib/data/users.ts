import 'server-only'
import { cache } from 'react'
import { Prisma } from '@/generated/prisma/client'
import { MINUTE } from '@/lib/constants-time'
import {
  currentUserSchema,
  updateProfileInput,
  type CurrentUser,
  type UpdateProfileInput,
} from '@/lib/dto/users'
import { invalidateTags, remember } from '@/lib/server/cache'
import { getSessionUser, requireUser, toRole } from './auth'
import { userTag } from './cacheTags'
import { db } from './db'
import { parseInput, UnauthorizedError, ValidationError } from './errors'

/** Selects exactly the `UserProfile` DTO; the row is the DTO, so drift fails to compile. */
export const userProfileSelect = {
  id: true,
  name: true,
  username: true,
  image: true,
} satisfies Prisma.UserSelect

export const currentUserSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  emailVerified: true,
  image: true,
  role: true,
} satisfies Prisma.UserSelect

const VIEWER_CACHE_TTL = 5 * MINUTE

/** The signed-in user's record, or null when signed out (e.g. for the nav bar). */
export const getViewer = cache(async (): Promise<CurrentUser | null> => {
  const sessionUser = await getSessionUser()
  if (!sessionUser) {
    return null
  }
  // The session was checked above; the record itself is the same for the user on every request.
  return remember(
    `user:${sessionUser.id}:viewer`,
    {
      ttl: VIEWER_CACHE_TTL,
      tags: [userTag(sessionUser.id)],
      schema: currentUserSchema.nullable(),
    },
    async () => {
      const row = await db.user.findUnique({
        where: { id: sessionUser.id },
        select: currentUserSelect,
      })
      return row ? { ...row, role: toRole(row.role) } : null
    },
  )
})

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const viewer = await getViewer()
  if (!viewer) {
    throw new UnauthorizedError()
  }
  return viewer
}

/**
 * Whether the viewer has a password (a `credential` account). An account created through Google
 * has none until it sets one with the "Forgot password" flow, so password-gated settings (change
 * password, delete account) cannot work for it yet. Not cached: one indexed lookup.
 */
export const hasPassword = async (): Promise<boolean> => {
  const viewer = await requireUser()
  const account = await db.account.findFirst({
    where: { userId: viewer.id, providerId: 'credential' },
    select: { id: true },
  })
  return account !== null
}

export const isUsernameTaken = async (username: string) => {
  return (await db.user.count({ where: { username } })) > 0
}

/**
 * Edits the viewer's own name and username. The username is unique, so a collision (also from a
 * race with another request) comes back as a field error.
 */
export const updateProfile = async (input: UpdateProfileInput): Promise<CurrentUser> => {
  const viewer = await requireUser()
  const data = parseInput(updateProfileInput, input)
  const user = await db.user
    .update({
      where: { id: viewer.id },
      data: {
        name: data.name,
        username: data.username,
      },
      select: currentUserSelect,
    })
    .catch((error: unknown) => {
      // Only `username` is unique among the fields written here.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ValidationError({ username: ['That username is taken'] })
      }
      throw error
    })
  await invalidateTags(userTag(viewer.id))
  return { ...user, role: toRole(user.role) }
}
