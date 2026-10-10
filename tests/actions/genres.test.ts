// @vitest-environment node
import { refresh } from 'next/cache'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createGenreAction, deleteGenreAction, updateGenreAction } from '@/actions/genres'
import { db } from '@/lib/data/db'
import { getRedis } from '@/lib/server/redis'
import { seedGenre } from '../helpers/catalog'
import { createUser, resetDatabase, signInAs } from '../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(async () => import('../helpers/cookies'))
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => requestHeaders(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), refresh: vi.fn() }))

describe('genre actions', () => {
  beforeEach(async () => {
    await resetDatabase()
    vi.mocked(refresh).mockClear()
  })
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  it('answer 401 signed out and 403 for an editor, without refreshing', async () => {
    const genre = await seedGenre('Drama')
    expect(await createGenreAction({ name: 'Comedy' })).toMatchObject({
      ok: false,
      code: 'UNAUTHORIZED',
    })
    await signInAs(await createUser({ role: 'editor' }))
    expect(await updateGenreAction({ id: genre.id, name: 'Dramas' })).toMatchObject({
      ok: false,
      code: 'FORBIDDEN',
    })
    expect(await deleteGenreAction(genre.id)).toMatchObject({ ok: false, code: 'FORBIDDEN' })
    expect(refresh).not.toHaveBeenCalled()
  })

  it('return field errors as a failed result', async () => {
    await signInAs(await createUser({ role: 'admin' }))
    expect(await createGenreAction({ name: '' })).toEqual({
      ok: false,
      code: 'VALIDATION',
      message: 'Validation failed',
      fieldErrors: { name: ['Name is required'] },
    })
    expect(refresh).not.toHaveBeenCalled()
  })

  it('create, update and delete a genre, refreshing the router each time', async () => {
    await signInAs(await createUser({ role: 'admin' }))

    const created = await createGenreAction({ name: 'Drama' })
    expect(created).toMatchObject({ ok: true, data: { name: 'Drama', slug: 'drama' } })
    const id = created.ok ? created.data.id : ''

    expect(await updateGenreAction({ id, name: 'Dramas' })).toMatchObject({
      ok: true,
      data: { id, name: 'Dramas', slug: 'drama' },
    })
    expect(await deleteGenreAction(id)).toEqual({ ok: true, data: undefined })
    expect(await db.genre.count()).toBe(0)
    expect(refresh).toHaveBeenCalledTimes(3)
  })
})
