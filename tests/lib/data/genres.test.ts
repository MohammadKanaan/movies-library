// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/lib/data/db'
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '@/lib/data/errors'
import { createGenre, deleteGenre, listGenres, updateGenre } from '@/lib/data/genres'
import { getRedis } from '@/lib/server/redis'
import { seedGenre, seedMovie } from '../../helpers/catalog'
import { createUser, resetDatabase, signInAs, signOut } from '../../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(
  async () => import('../../helpers/cookies'),
)
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => requestHeaders(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), refresh: vi.fn() }))

const signInAsAdmin = async () => signInAs(await createUser({ role: 'admin' }))

describe('genres DAL', () => {
  beforeEach(resetDatabase)
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  describe('listGenres', () => {
    it('is public and lists genres by name with their movie counts', async () => {
      const drama = await seedGenre('Drama')
      const scifi = await seedGenre('Science Fiction')
      await seedGenre('Animation')
      await seedMovie({ title: 'Dune', releaseDate: '2021-10-22', genreIds: [drama.id, scifi.id] })
      await seedMovie({ title: 'Arrival', releaseDate: '2016-11-11', genreIds: [scifi.id] })

      expect(await listGenres()).toEqual([
        { id: expect.any(String), name: 'Animation', slug: 'animation', movieCount: 0 },
        { id: drama.id, name: 'Drama', slug: 'drama', movieCount: 1 },
        { id: scifi.id, name: 'Science Fiction', slug: 'science-fiction', movieCount: 2 },
      ])
    })

    it('is cached until a catalog write invalidates it', async () => {
      await seedGenre('Drama')
      expect(await listGenres()).toHaveLength(1)
      // A write that bypasses the DAL is not seen: the entry is served from Redis.
      await seedGenre('Horror')
      expect(await listGenres()).toHaveLength(1)

      await signInAsAdmin()
      await createGenre({ name: 'Comedy' })
      expect((await listGenres()).map((genre) => genre.name)).toEqual(['Comedy', 'Drama', 'Horror'])
    })
  })

  describe('createGenre', () => {
    it('requires an admin: 401 signed out, 403 for a viewer or an editor', async () => {
      await expect(createGenre({ name: 'Drama' })).rejects.toBeInstanceOf(UnauthorizedError)
      for (const role of ['viewer', 'editor'] as const) {
        await signInAs(await createUser({ role }))
        await expect(createGenre({ name: 'Drama' })).rejects.toBeInstanceOf(ForbiddenError)
      }
      expect(await db.genre.count()).toBe(0)
    })

    it('validates the name', async () => {
      await signInAsAdmin()
      await expect(createGenre({ name: '  ' })).rejects.toMatchObject({
        code: 'VALIDATION',
        fieldErrors: { name: ['Name is required'] },
      })
    })

    it('creates the genre with a slug derived from its name', async () => {
      await signInAsAdmin()
      const genre = await createGenre({ name: '  Science Fiction ' })
      expect(genre).toEqual({
        id: expect.any(String),
        name: 'Science Fiction',
        slug: 'science-fiction',
        movieCount: 0,
      })
      expect(await db.genre.findUnique({ where: { id: genre.id } })).toMatchObject({
        slug: 'science-fiction',
      })
    })

    it('reports a genre that already exists, by name or by slug, as a field error', async () => {
      await signInAsAdmin()
      await createGenre({ name: 'Sci-Fi' })
      const taken = { code: 'VALIDATION', fieldErrors: { name: ['That genre already exists'] } }
      await expect(createGenre({ name: 'Sci-Fi' })).rejects.toMatchObject(taken)
      await expect(createGenre({ name: 'SCI FI' })).rejects.toMatchObject(taken)
      expect(await db.genre.count()).toBe(1)
    })
  })

  describe('updateGenre', () => {
    it('requires an admin, then a valid id, then an existing genre', async () => {
      const genre = await seedGenre('Drama')
      await expect(updateGenre({ id: genre.id, name: 'Dramas' })).rejects.toBeInstanceOf(
        UnauthorizedError,
      )
      await signInAs(await createUser({ role: 'editor' }))
      await expect(updateGenre({ id: genre.id, name: 'Dramas' })).rejects.toBeInstanceOf(
        ForbiddenError,
      )
      await signInAsAdmin()
      await expect(updateGenre({ id: 'a b', name: 'Dramas' })).rejects.toBeInstanceOf(
        ValidationError,
      )
      await expect(updateGenre({ id: crypto.randomUUID(), name: 'Dramas' })).rejects.toBeInstanceOf(
        NotFoundError,
      )
      expect(await db.genre.findUnique({ where: { id: genre.id } })).toMatchObject({
        name: 'Drama',
      })
    })

    it('renames the genre and keeps its slug', async () => {
      const genre = await seedGenre('Sci-Fi')
      await signInAsAdmin()
      expect(await updateGenre({ id: genre.id, name: 'Science Fiction' })).toEqual({
        id: genre.id,
        name: 'Science Fiction',
        slug: 'sci-fi',
        movieCount: 0,
      })
    })

    it('reports a name another genre has as a field error', async () => {
      const genre = await seedGenre('Drama')
      await seedGenre('Comedy')
      await signInAsAdmin()
      await expect(updateGenre({ id: genre.id, name: 'Comedy' })).rejects.toMatchObject({
        fieldErrors: { name: ['That genre already exists'] },
      })
    })
  })

  describe('deleteGenre', () => {
    it('requires an admin, then a valid id, then an existing genre', async () => {
      const genre = await seedGenre('Drama')
      await expect(deleteGenre(genre.id)).rejects.toBeInstanceOf(UnauthorizedError)
      await signInAs(await createUser({ role: 'viewer' }))
      await expect(deleteGenre(genre.id)).rejects.toBeInstanceOf(ForbiddenError)
      await signInAsAdmin()
      await expect(deleteGenre('a b')).rejects.toBeInstanceOf(ValidationError)
      await expect(deleteGenre(crypto.randomUUID())).rejects.toBeInstanceOf(NotFoundError)
      expect(await db.genre.count()).toBe(1)
    })

    it('refuses to delete a genre that movies still carry', async () => {
      const genre = await seedGenre('Drama')
      await seedMovie({ title: 'Dune', releaseDate: '2021-10-22', genreIds: [genre.id] })
      await seedMovie({ title: 'Arrival', releaseDate: '2016-11-11', genreIds: [genre.id] })
      await signInAsAdmin()
      await expect(deleteGenre(genre.id)).rejects.toMatchObject({
        code: 'VALIDATION',
        fieldErrors: { base: ['Remove the genre from its 2 movies first'] },
      })
      expect(await db.genre.count()).toBe(1)
    })

    it('deletes an unused genre and drops it from the cached list', async () => {
      const genre = await seedGenre('Drama')
      expect(await listGenres()).toHaveLength(1)
      await signInAsAdmin()
      await deleteGenre(genre.id)
      signOut()
      expect(await listGenres()).toEqual([])
      expect(await db.genre.count()).toBe(0)
    })
  })
})
