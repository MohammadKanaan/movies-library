// @vitest-environment node
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/lib/data/db'
import { listMovies } from '@/lib/data/movies'
import { getRedis } from '@/lib/server/redis'
import { seedMovie } from '../helpers/catalog'
import { resetDatabase } from '../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(async () => import('../helpers/cookies'))
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => requestHeaders(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), refresh: vi.fn() }))

const run = promisify(execFile)

describe('catalog seed', () => {
  beforeEach(resetDatabase)
  afterAll(async () => {
    await resetDatabase()
    await db.$disconnect()
    await getRedis().quit()
  })

  it('replaces the previous catalog and refreshes the cached movie list', async () => {
    const previous = await seedMovie({ title: 'Previous catalog movie', releaseDate: '2024-01-01' })
    expect((await listMovies({})).items.map((movie) => movie.id)).toEqual([previous.id])

    await run(process.execPath, ['prisma/seed.ts'], { env: process.env })

    const movies = await listMovies({})
    expect(movies.totalItems).toBe(1018)
    expect(movies.items.some((movie) => movie.id === previous.id)).toBe(false)
    expect(await db.movie.findUnique({ where: { id: previous.id } })).toBeNull()
    expect(await db.movie.count()).toBe(1018)
  }, 60_000)
})
