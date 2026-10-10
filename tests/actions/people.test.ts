// @vitest-environment node
import { refresh } from 'next/cache'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  attachHeadshotAction,
  createPersonAction,
  deletePersonAction,
  removeHeadshotAction,
  updatePersonAction,
} from '@/actions/people'
import { db } from '@/lib/data/db'
import { getRedis } from '@/lib/server/redis'
import { seedMovie, seedPerson } from '../helpers/catalog'
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

describe('people actions', () => {
  beforeEach(async () => {
    await resetDatabase()
    vi.mocked(refresh).mockClear()
  })
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  it('answer 401 signed out and 403 for a viewer, without refreshing', async () => {
    const amy = await seedPerson('Amy Adams')
    expect(await createPersonAction({ name: 'Zendaya' })).toMatchObject({
      ok: false,
      code: 'UNAUTHORIZED',
    })
    await signInAs(await createUser({ role: 'viewer' }))
    expect(await updatePersonAction({ id: amy.id, name: 'Amy' })).toMatchObject({
      ok: false,
      code: 'FORBIDDEN',
    })
    expect(await deletePersonAction(amy.id)).toMatchObject({ ok: false, code: 'FORBIDDEN' })
    expect(await removeHeadshotAction(amy.id)).toMatchObject({ ok: false, code: 'FORBIDDEN' })
    expect(refresh).not.toHaveBeenCalled()
  })

  it('return field errors as a failed result', async () => {
    await signInAs(await createUser({ role: 'admin' }))
    expect(await createPersonAction({ name: ' ' })).toMatchObject({
      ok: false,
      code: 'VALIDATION',
      fieldErrors: { name: ['Name is required'] },
    })
    expect(await updatePersonAction({ id: 'nope', name: 'Amy' })).toMatchObject({
      ok: false,
      code: 'VALIDATION',
      fieldErrors: { id: ['Invalid id'] },
    })
    expect(refresh).not.toHaveBeenCalled()
  })

  it('create, update and delete a person, refreshing the router each time', async () => {
    await signInAs(await createUser({ role: 'admin' }))

    const created = await createPersonAction({ name: 'Amy Adams' })
    expect(created).toMatchObject({ ok: true, data: { name: 'Amy Adams', slug: 'amy-adams' } })
    const id = created.ok ? created.data.id : ''

    expect(await updatePersonAction({ id, name: 'Amy Lou Adams' })).toMatchObject({
      ok: true,
      data: { id, name: 'Amy Lou Adams', slug: 'amy-adams' },
    })
    expect(await deletePersonAction(id)).toEqual({ ok: true, data: undefined })
    expect(await db.person.count()).toBe(0)
    expect(refresh).toHaveBeenCalledTimes(3)
  })

  it('attach and remove a headshot, refreshing each time', async () => {
    const amy = await seedPerson('Amy Adams')
    const admin = await createUser({ role: 'admin' })
    await signInAs(admin)
    const key = `headshots/${admin.id}/${crypto.randomUUID()}`

    expect(await attachHeadshotAction({ id: amy.id, key })).toMatchObject({
      ok: true,
      data: { id: amy.id, headshotUrl: `${BUCKET_URL}${key}` },
    })
    expect(await removeHeadshotAction(amy.id)).toMatchObject({
      ok: true,
      data: { id: amy.id, headshotUrl: null },
    })
    expect(await attachHeadshotAction({ id: amy.id, key: 'nope' })).toMatchObject({
      ok: false,
      code: 'VALIDATION',
    })
    expect(refresh).toHaveBeenCalledTimes(2)
  })

  it('report a credited person as a failed delete', async () => {
    const amy = await seedPerson('Amy Adams')
    await seedMovie({
      title: 'Arrival',
      releaseDate: '2016-11-11',
      credits: [{ personId: amy.id, role: 'ACTOR' }],
    })
    await signInAs(await createUser({ role: 'admin' }))
    expect(await deletePersonAction(amy.id)).toMatchObject({ ok: false, code: 'VALIDATION' })
    expect(refresh).not.toHaveBeenCalled()
  })
})
