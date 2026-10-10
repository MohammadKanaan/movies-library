import { z } from 'zod'
import { signUpInput } from './auth'
import { pageQuerySchema } from './common'

/**
 * The roles, matching the `users_role_valid` CHECK constraint and the admin plugin's `roles`
 * (`lib/data/auth.ts`): `viewer` is the default and `admin` the only admin role. What an editor may
 * do is decided by this app's own policies.
 */
export const roleSchema = z.enum(['viewer', 'editor', 'admin'])

export type Role = z.infer<typeof roleSchema>

/**
 * A user id. Ids are UUID columns, so anything else would make PostgreSQL throw: it is refused here
 * as a validation error instead.
 */
export const userIdSchema = z.uuid('Invalid user id')

/** What anyone may see about a user (e.g. a post's author). */
export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
})

export type UserProfile = z.infer<typeof userProfileSchema>

/** The signed-in user's own record. */
export const currentUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  role: roleSchema,
})

export type CurrentUser = z.infer<typeof currentUserSchema>

/** Profile edits. Name and username follow the sign-up rules. */
export const updateProfileInput = z.object({
  name: signUpInput.shape.name,
  username: signUpInput.shape.username,
})

export type UpdateProfileInput = z.infer<typeof updateProfileInput>

/** Session ids are UUIDs (Prisma generates them for Better Auth), like user ids. */
export const sessionIdSchema = z.uuid('Invalid session')

/** One of the viewer's own sessions. Never carries the token. */
export const sessionSummarySchema = z.object({
  id: z.string(),
  current: z.boolean(),
  userAgent: z.string().nullable(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
})

export type SessionSummary = z.infer<typeof sessionSummarySchema>

export const USER_SEARCH_MAX_LENGTH = 100
export const BAN_REASON_MAX_LENGTH = 200

/** One row of the admin user list. Admin-only: it carries the email and the ban. */
export const adminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  role: roleSchema,
  banned: z.boolean(),
  banReason: z.string().nullable(),
  createdAt: z.coerce.date(),
})

export type AdminUser = z.infer<typeof adminUserSchema>

export const listUsersQuery = pageQuerySchema.extend({
  /** Matches name, username or email, case-insensitively; bounded because it is free text. */
  q: z.string().trim().max(USER_SEARCH_MAX_LENGTH).optional(),
})

export type ListUsersQuery = z.infer<typeof listUsersQuery>

/** The tolerant URL contract of the admin list: any query string parses, falling back to defaults. */
export const usersUrlQuery = z.object({
  page: pageQuerySchema.shape.page.catch(1),
  q: z.string().trim().max(USER_SEARCH_MAX_LENGTH).catch(''),
})

export const setUserRoleInput = z.object({ id: userIdSchema, role: roleSchema })

export type SetUserRoleInput = z.infer<typeof setUserRoleInput>

/** `reason` is shown to the banned user by Better Auth when they try to sign in. */
export const banUserInput = z.object({
  id: userIdSchema,
  reason: z
    .string()
    .trim()
    .max(BAN_REASON_MAX_LENGTH, `Reason must be ${BAN_REASON_MAX_LENGTH} characters or fewer`)
    .optional(),
})

export type BanUserInput = z.infer<typeof banUserInput>
