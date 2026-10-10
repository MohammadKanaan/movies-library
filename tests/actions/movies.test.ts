// @vitest-environment node
import { refresh } from 'next/cache'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  attachPosterAction,
  createMovieAction,
  deleteMovieAction,
  removePosterAction,
  updateMovieAction,
} from '@/actions/movies'
import { db } from '@/lib/data/db'
import type { MovieInput } from '@/lib/dto/movies'
import { getRedis } from '@/lib/server/redis'
import { seedGenre, seedMovie, seedPerson } from '../helpers/catalog'
import { createUser, resetDatabase, signInAs } from '../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(async () => import('../helpers/cookies'))
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => requestHeaders(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), refresh: vi.fn() }))
const BUCKET_URL = vi.hoisted(() => 'https://pub-abc.r2.dev/')
vi.mock('@/lib/server/storage', () => ({
  isStorageConfigured: vi.fn(() => true),
  createUploadTicket: vi.fn(async () => ({ url: 'https://r2.example/put', headers: {} })),
  headObject: vi.fn(async () => ({ size: 4096, contentType: 'image/jpeg' })),
  deleteObject: vi.fn(async () => {}),
  publicUrl: (key: string) => `${BUCKET_URL}${key}`,
  keyFromPublicUrl: (url: string | null) =>
    url?.startsWith(BUCKET_URL) ? url.slice(BUCKET_URL.length) : null,
}))

const movieInputWith = async (): Promise<MovieInput> => {
  const denis = await seedPerson('Denis Villeneuve')
  const scifi = await seedGenre('Science Fiction')
  return {
    title: 'Dune',
    releaseDate: '2021-10-22',
    runtimeMinutes: 155,
    genreIds: [scifi.id],
    credits: [{ personId: denis.id, role: 'DIRECTOR' }],
  }
}

describe('movie actions', () => {
  beforeEach(async () => {
    await resetDatabase()
    vi.mocked(refresh).mockClear()
  })
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  it('answer 401 signed out and 403 for an editor, without refreshing', async () => {
    const input = await movieInputWith()
    const dune = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
    expect(await createMovieAction(input)).toMatchObject({ ok: false, code: 'UNAUTHORIZED' })
    const editor = await createUser({ role: 'editor' })
    await signInAs(editor)
    expect(await updateMovieAction({ ...input, id: dune.id })).toMatchObject({
      ok: false,
      code: 'FORBIDDEN',
    })
    expect(await deleteMovieAction(dune.id)).toMatchObject({ ok: false, code: 'FORBIDDEN' })
    expect(
      await attachPosterAction({ id: dune.id, key: `posters/${editor.id}/${crypto.randomUUID()}` }),
    ).toMatchObject({ ok: false, code: 'FORBIDDEN' })
    expect(await removePosterAction(dune.id)).toMatchObject({ ok: false, code: 'FORBIDDEN' })
    expect(refresh).not.toHaveBeenCalled()
    expect(await db.movie.count()).toBe(1)
  })

  it('return field errors as a failed result', async () => {
    const input = await movieInputWith()
    await signInAs(await createUser({ role: 'admin' }))
    const result = await createMovieAction({ ...input, title: '', releaseDate: '2021-13-01' })
    expect(result).toMatchObject({ ok: false, code: 'VALIDATION' })
    expect(!result.ok && Object.keys(result.fieldErrors ?? {}).sort()).toEqual([
      'releaseDate',
      'title',
    ])
    expect(refresh).not.toHaveBeenCalled()
  })

  it('create, update, attach and remove a poster, and delete, refreshing each time', async () => {
    const input = await movieInputWith()
    const admin = await createUser({ role: 'admin' })
    await signInAs(admin)

    const created = await createMovieAction(input)
    expect(created).toMatchObject({ ok: true, data: { slug: 'dune-2021', title: 'Dune' } })
    const id = created.ok ? created.data.id : ''

    expect(await updateMovieAction({ ...input, id, title: 'Dune: Part One' })).toMatchObject({
      ok: true,
      data: { id, slug: 'dune-2021', title: 'Dune: Part One' },
    })

    const key = `posters/${admin.id}/${crypto.randomUUID()}`
    expect(await attachPosterAction({ id, key })).toMatchObject({
      ok: true,
      data: { id, posterUrl: `${BUCKET_URL}${key}` },
    })
    expect(await removePosterAction(id)).toMatchObject({ ok: true, data: { id, posterUrl: null } })

    expect(await deleteMovieAction(id)).toEqual({ ok: true, data: undefined })
    expect(await db.movie.count()).toBe(0)
    expect(refresh).toHaveBeenCalledTimes(5)
  })

  it('report a missing movie as not found', async () => {
    await signInAs(await createUser({ role: 'admin' }))
    expect(await deleteMovieAction(crypto.randomUUID())).toMatchObject({
      ok: false,
      code: 'NOT_FOUND',
    })
    expect(refresh).not.toHaveBeenCalled()
  })
})
