// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { auth } from '@/lib/data/auth'
import { db } from '@/lib/data/db'
import { UnauthorizedError, ValidationError } from '@/lib/data/errors'
import {
  getCurrentUser,
  getViewer,
  hasPassword,
  isUsernameTaken,
  updateProfile,
} from '@/lib/data/users'
import { getRedis } from '@/lib/server/redis'
import { cookieJar } from '../../helpers/cookies'
import { clearMail, flushMail, sentMailsWithSubject, tokenOf } from '../../helpers/mail'
import { createUser, resetDatabase, signInAs } from '../../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(
  async () => import('../../helpers/cookies'),
)
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => requestHeaders(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), refresh: vi.fn() }))

describe('users DAL', () => {
  beforeEach(async () => {
    await resetDatabase()
    clearMail()
  })
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  it('has no viewer when signed out', async () => {
    expect(await getViewer()).toBeNull()
    await expect(getCurrentUser()).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('reports whether the viewer has a password', async () => {
    await expect(hasPassword()).rejects.toBeInstanceOf(UnauthorizedError)

    const user = await createUser({})
    await signInAs(user)
    expect(await hasPassword()).toBe(true)

    // An account created through Google has no credential account.
    await db.account.deleteMany({ where: { userId: user.id, providerId: 'credential' } })
    await db.account.create({
      data: {
        accountId: 'google-sub',
        providerId: 'google',
        userId: user.id,
      },
    })
    expect(await hasPassword()).toBe(false)
  })

  it('treats a forged or stale session cookie as no viewer', async () => {
    cookieJar.set('better-auth.session_token', 'forged.value')
    expect(await getViewer()).toBeNull()
    await expect(getCurrentUser()).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('returns exactly the current-user fields when signed in', async () => {
    const user = await createUser({ name: 'Ada', username: 'ada', email: 'ada@example.com' })
    await signInAs(user)
    const expected = {
      id: user.id,
      name: 'Ada',
      username: 'ada',
      email: 'ada@example.com',
      emailVerified: false,
      image: null,
      role: 'viewer',
    }
    expect(await getViewer()).toEqual(expected)
    expect(await getCurrentUser()).toEqual(expected)
  })

  it('serves the viewer from the cache, and a Better Auth user update refreshes it', async () => {
    const user = await createUser({ name: 'Ada' })
    await signInAs(user)
    expect((await getViewer())?.name).toBe('Ada')

    // Straight to the database: the cached viewer is served until its tag is invalidated.
    await db.user.update({ where: { id: user.id }, data: { name: 'Direct' } })
    expect((await getViewer())?.name).toBe('Ada')

    // A Better Auth-side update (what email verification does) fires the hook that invalidates it.
    await auth.api.updateUser({ body: { name: 'Via Better Auth' }, headers: requestHeaders() })
    expect((await getViewer())?.name).toBe('Via Better Auth')
  })

  it('flips the cached viewer to verified when the emailed link is opened', async () => {
    const user = await createUser({})
    await flushMail()
    const [mail] = sentMailsWithSubject('Verify your email')
    expect(mail.to).toBe(user.email)

    await signInAs(user)
    expect((await getViewer())?.emailVerified).toBe(false)

    await auth.api.verifyEmail({ query: { token: tokenOf(mail) }, headers: requestHeaders() })

    expect((await getViewer())?.emailVerified).toBe(true)
  })

  it('reports whether a username is taken', async () => {
    await createUser({ username: 'taken' })
    expect(await isUsernameTaken('taken')).toBe(true)
    expect(await isUsernameTaken('free')).toBe(false)
  })

  describe('updateProfile', () => {
    it('requires a session', async () => {
      await expect(updateProfile({ name: 'Ada', username: 'ada' })).rejects.toBeInstanceOf(
        UnauthorizedError,
      )
    })

    it('validates its input itself, whoever calls', async () => {
      const user = await createUser({ name: 'Kept' })
      await signInAs(user)
      const error = await updateProfile({
        name: '',
        username: 'A!',
      }).catch((caught: unknown) => caught)
      expect(error).toBeInstanceOf(ValidationError)
      expect(Object.keys((error as ValidationError).fieldErrors ?? {}).sort()).toEqual([
        'name',
        'username',
      ])
      expect(await db.user.findUniqueOrThrow({ where: { id: user.id } })).toMatchObject({
        name: 'Kept',
      })
    })

    it('updates name and username of the viewer only', async () => {
      const user = await createUser({ name: 'Old', username: 'old_name' })
      const other = await createUser({ name: 'Other', username: 'other_one' })
      await signInAs(user)

      const updated = await updateProfile({
        name: 'New Name',
        username: 'new_name',
      })

      expect(updated).toMatchObject({
        id: user.id,
        name: 'New Name',
        username: 'new_name',
      })
      expect(await db.user.findUniqueOrThrow({ where: { id: other.id } })).toMatchObject({
        name: 'Other',
        username: 'other_one',
      })
    })

    it('reports a taken username as a field error and changes nothing', async () => {
      await createUser({ username: 'taken_name' })
      const user = await createUser({ name: 'Me', username: 'mine' })
      await signInAs(user)
      const error = await updateProfile({
        name: 'Changed',
        username: 'taken_name',
      }).catch((caught: unknown) => caught)
      expect(error).toBeInstanceOf(ValidationError)
      expect(error).toMatchObject({ fieldErrors: { username: ['That username is taken'] } })
      expect(await db.user.findUniqueOrThrow({ where: { id: user.id } })).toMatchObject({
        name: 'Me',
        username: 'mine',
      })
    })

    it('lets the user keep their own username', async () => {
      const user = await createUser({ username: 'same_name' })
      await signInAs(user)
      await expect(
        updateProfile({ name: 'Renamed', username: 'same_name' }),
      ).resolves.toMatchObject({ name: 'Renamed', username: 'same_name' })
    })

    it('refreshes the cached viewer', async () => {
      const user = await createUser({ name: 'Before', username: 'before_name' })
      await signInAs(user)
      expect((await getViewer())?.name).toBe('Before')

      await updateProfile({ name: 'After', username: 'after_name' })

      expect(await getViewer()).toMatchObject({ name: 'After', username: 'after_name' })
    })
  })
})
