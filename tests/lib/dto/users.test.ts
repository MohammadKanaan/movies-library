import { describe, expect, it } from 'vitest'
import { MAX_PAGE } from '@/lib/dto/common'
import {
  adminUserSchema,
  BAN_REASON_MAX_LENGTH,
  banUserInput,
  listUsersQuery,
  roleSchema,
  sessionIdSchema,
  setUserRoleInput,
  updateProfileInput,
  USER_SEARCH_MAX_LENGTH,
  usersUrlQuery,
} from '@/lib/dto/users'

const ID = '0190d1a2-0000-7000-8000-000000000001'

const valid = { name: 'Ada Lovelace', username: 'ada_l' }

describe('updateProfileInput', () => {
  it('trims the name and follows the sign-up username rules', () => {
    expect(updateProfileInput.parse({ ...valid, name: '  Ada  ' }).name).toBe('Ada')
    const result = updateProfileInput.safeParse({ name: '', username: 'A!' })
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual([
      'name',
      'username',
      'username',
    ])
  })
})

describe('sessions', () => {
  it('takes only a UUID as a session id', () => {
    expect(sessionIdSchema.safeParse(ID).success).toBe(true)
    expect(sessionIdSchema.safeParse('abc').success).toBe(false)
    expect(sessionIdSchema.safeParse('').success).toBe(false)
  })
})

describe('admin user list', () => {
  it('bounds and trims the search, and defaults the paging', () => {
    expect(listUsersQuery.parse({})).toMatchObject({ page: 1 })
    expect(listUsersQuery.parse({ q: '  ada ' }).q).toBe('ada')
    expect(listUsersQuery.safeParse({ q: 'a'.repeat(USER_SEARCH_MAX_LENGTH + 1) }).success).toBe(
      false,
    )
    expect(listUsersQuery.safeParse({ page: String(MAX_PAGE + 1) }).success).toBe(false)
  })

  it('filters by a known role and by status', () => {
    expect(listUsersQuery.parse({ role: 'editor', status: 'banned' })).toMatchObject({
      role: 'editor',
      status: 'banned',
    })
    expect(listUsersQuery.safeParse({ role: 'owner' }).success).toBe(false)
    expect(listUsersQuery.safeParse({ status: 'deleted' }).success).toBe(false)
  })

  it('parses any URL by falling back per field', () => {
    expect(usersUrlQuery.parse({})).toEqual({
      page: 1,
      q: '',
      role: '',
      status: '',
      sortBy: 'createdAt',
      direction: 'desc',
    })
    expect(
      usersUrlQuery.parse({ page: 'abc', q: 'a'.repeat(101), role: 'owner', status: 'x' }),
    ).toEqual({ page: 1, q: '', role: '', status: '', sortBy: 'createdAt', direction: 'desc' })
    expect(usersUrlQuery.parse({ page: '2', q: ' ada ', role: 'admin', status: 'active' })).toEqual(
      {
        page: 2,
        q: 'ada',
        role: 'admin',
        status: 'active',
        sortBy: 'createdAt',
        direction: 'desc',
      },
    )
  })

  it('accepts a user id and a known role only', () => {
    expect(setUserRoleInput.parse({ id: ID, role: 'admin' })).toEqual({
      id: ID,
      role: 'admin',
    })
    expect(setUserRoleInput.safeParse({ id: ID, role: 'owner' }).success).toBe(false)
    expect(setUserRoleInput.safeParse({ id: 'a b', role: 'viewer' }).success).toBe(false)
    expect(setUserRoleInput.safeParse({ id: '', role: 'viewer' }).success).toBe(false)
  })

  it('accepts a user id and an optional, trimmed, bounded ban reason', () => {
    expect(banUserInput.parse({ id: ID })).toEqual({ id: ID })
    expect(banUserInput.parse({ id: ID, reason: '  Spam  ' })).toEqual({
      id: ID,
      reason: 'Spam',
    })
    expect(banUserInput.parse({ id: ID, reason: '   ' }).reason).toBe('')
    expect(banUserInput.safeParse({ id: 'a b', reason: 'Spam' }).success).toBe(false)
    const long = banUserInput.safeParse({
      id: ID,
      reason: 'x'.repeat(BAN_REASON_MAX_LENGTH + 1),
    })
    expect(long.success).toBe(false)
    expect(long.error?.issues[0]).toMatchObject({
      path: ['reason'],
      message: `Reason must be ${BAN_REASON_MAX_LENGTH} characters or fewer`,
    })
  })
})

describe('adminUserSchema', () => {
  const row = {
    id: 'u1',
    name: 'Ada',
    username: 'ada',
    email: 'ada@example.com',
    emailVerified: true,
    role: 'admin',
    banned: false,
    banReason: null,
    createdAt: '2026-10-05T15:04:00.000Z',
  }

  it('carries the role and the ban, coerces the date, and drops anything else', () => {
    const parsed = adminUserSchema.parse({ ...row, postCount: 4, banExpires: null })
    expect(parsed).toEqual({ ...row, createdAt: new Date(row.createdAt) })
    expect(parsed).not.toHaveProperty('postCount')
    expect(parsed).not.toHaveProperty('banExpires')
    expect(adminUserSchema.parse({ ...row, banned: true, banReason: 'Spam' })).toMatchObject({
      banned: true,
      banReason: 'Spam',
    })
  })

  it('rejects a role that is not one of ours', () => {
    expect(roleSchema.options).toEqual(['viewer', 'editor', 'admin'])
    expect(adminUserSchema.safeParse({ ...row, role: 'owner' }).success).toBe(false)
    expect(adminUserSchema.safeParse({ ...row, role: 'admin,user' }).success).toBe(false)
  })
})
