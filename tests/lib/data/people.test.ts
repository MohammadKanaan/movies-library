// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/lib/data/db'
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '@/lib/data/errors'
import {
  createPerson,
  deletePerson,
  getPersonBySlug,
  listPeople,
  updatePerson,
} from '@/lib/data/people'
import { getRedis } from '@/lib/server/redis'
import { seedMovie, seedPerson } from '../../helpers/catalog'
import { createUser, resetDatabase, signInAs, signOut } from '../../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(
  async () => import('../../helpers/cookies'),
)
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => requestHeaders(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), refresh: vi.fn() }))

const all = { page: 1, perPage: 10 }

const signInAsAdmin = async () => signInAs(await createUser({ role: 'admin' }))

describe('people DAL', () => {
  beforeEach(resetDatabase)
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  describe('listPeople', () => {
    it('is public and lists people by name with their credit count and creation date', async () => {
      const denis = await seedPerson('Denis Villeneuve')
      const amy = await seedPerson('Amy Adams')
      await seedMovie({
        title: 'Arrival',
        releaseDate: '2016-11-11',
        credits: [
          { personId: denis.id, role: 'DIRECTOR' },
          { personId: amy.id, role: 'ACTOR' },
        ],
      })
      // Two roles on one movie are two credits.
      await seedMovie({
        title: 'Dune',
        releaseDate: '2021-10-22',
        credits: [
          { personId: denis.id, role: 'DIRECTOR' },
          { personId: denis.id, role: 'WRITER' },
        ],
      })
      const page = await listPeople(all)
      expect(page).toMatchObject({ page: 1, perPage: 10, totalItems: 2, totalPages: 1 })
      expect(page.items).toEqual([
        {
          id: amy.id,
          slug: 'amy-adams',
          name: 'Amy Adams',
          creditCount: 1,
          createdAt: expect.any(Date),
        },
        {
          id: denis.id,
          slug: 'denis-villeneuve',
          name: 'Denis Villeneuve',
          creditCount: 3,
          createdAt: expect.any(Date),
        },
      ])
    })

    it('validates the query', async () => {
      await expect(listPeople({ page: 0, perPage: 10 })).rejects.toBeInstanceOf(ValidationError)
      await expect(listPeople({ ...all, q: 'a'.repeat(101) })).rejects.toBeInstanceOf(
        ValidationError,
      )
      // The trigram index cannot serve fewer than three characters.
      await expect(listPeople({ ...all, q: 'de' })).rejects.toBeInstanceOf(ValidationError)
    })

    it('searches the name case-insensitively and treats wildcards literally', async () => {
      await seedPerson('Denis Villeneuve')
      await seedPerson('Amy Adams')
      await seedPerson('100% Real')
      const names = async (q: string) => (await listPeople({ ...all, q })).items.map((p) => p.name)
      expect(await names('VILLENEUVE')).toEqual(['Denis Villeneuve'])
      expect(await names('amy')).toEqual(['Amy Adams'])
      expect(await names('100%')).toEqual(['100% Real'])
      // `_` would match any character ("y A" in Amy Adams); literally it matches nothing here.
      expect(await names('y_a')).toEqual([])
      expect(await names('   ')).toHaveLength(3)
    })

    it('paginates', async () => {
      for (const n of [1, 2, 3, 4, 5]) {
        await seedPerson(`Person ${n}`)
      }
      const first = await listPeople({ page: 1, perPage: 2 })
      const third = await listPeople({ page: 3, perPage: 2 })
      expect(first).toMatchObject({ totalItems: 5, totalPages: 3 })
      expect(first.items.map((p) => p.name)).toEqual(['Person 1', 'Person 2'])
      expect(third.items.map((p) => p.name)).toEqual(['Person 5'])
    })

    it('caches the plain list but never a search', async () => {
      await seedPerson('Amy Adams')
      expect((await listPeople(all)).totalItems).toBe(1)
      expect((await listPeople({ ...all, q: 'ada' })).totalItems).toBe(1)
      await seedPerson('Adam Driver')
      expect((await listPeople(all)).totalItems).toBe(1)
      expect((await listPeople({ ...all, q: 'ada' })).totalItems).toBe(2)

      await signInAsAdmin()
      await createPerson({ name: 'Zendaya' })
      expect((await listPeople(all)).totalItems).toBe(3)
    })
  })

  describe('getPersonBySlug', () => {
    it('is public and answers not found for an unknown or malformed slug', async () => {
      await expect(getPersonBySlug('nobody')).rejects.toBeInstanceOf(NotFoundError)
      await expect(getPersonBySlug('Not A Slug')).rejects.toBeInstanceOf(NotFoundError)
      await expect(getPersonBySlug('')).rejects.toBeInstanceOf(NotFoundError)
    })

    it('groups the filmography by role, newest release first', async () => {
      const denis = await seedPerson('Denis Villeneuve')
      const arrival = await seedMovie({
        title: 'Arrival',
        releaseDate: '2016-11-11',
        credits: [{ personId: denis.id, role: 'DIRECTOR' }],
      })
      const dune = await seedMovie({
        title: 'Dune',
        releaseDate: '2021-10-22',
        posterUrl: 'https://pub.example/dune.jpg',
        credits: [
          { personId: denis.id, role: 'DIRECTOR' },
          { personId: denis.id, role: 'WRITER' },
        ],
      })

      const person = await getPersonBySlug('denis-villeneuve')
      expect(person).toEqual({
        id: denis.id,
        slug: 'denis-villeneuve',
        name: 'Denis Villeneuve',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        filmography: {
          directed: [
            {
              id: dune.id,
              slug: 'dune-2021',
              title: 'Dune',
              releaseDate: new Date('2021-10-22T00:00:00.000Z'),
              posterUrl: 'https://pub.example/dune.jpg',
            },
            {
              id: arrival.id,
              slug: 'arrival-2016',
              title: 'Arrival',
              releaseDate: new Date('2016-11-11T00:00:00.000Z'),
              posterUrl: null,
            },
          ],
          written: [expect.objectContaining({ id: dune.id })],
          acted: [],
        },
        permissions: { update: false, delete: false },
      })
    })

    it('computes the permissions for the viewer on top of the cached record', async () => {
      await seedPerson('Amy Adams')
      expect((await getPersonBySlug('amy-adams')).permissions).toEqual({
        update: false,
        delete: false,
      })
      await signInAs(await createUser({ role: 'editor' }))
      expect((await getPersonBySlug('amy-adams')).permissions).toEqual({
        update: false,
        delete: false,
      })
      await signInAsAdmin()
      expect((await getPersonBySlug('amy-adams')).permissions).toEqual({
        update: true,
        delete: true,
      })
    })

    it('is cached until a catalog write invalidates it', async () => {
      const amy = await seedPerson('Amy Adams')
      expect((await getPersonBySlug('amy-adams')).name).toBe('Amy Adams')
      await db.person.update({ where: { id: amy.id }, data: { name: 'Amy Lou Adams' } })
      expect((await getPersonBySlug('amy-adams')).name).toBe('Amy Adams')

      await signInAsAdmin()
      await updatePerson({ id: amy.id, name: 'Amy Lou Adams' })
      signOut()
      expect((await getPersonBySlug('amy-adams')).name).toBe('Amy Lou Adams')
    })
  })

  describe('createPerson', () => {
    it('requires an admin: 401 signed out, 403 for a viewer or an editor', async () => {
      await expect(createPerson({ name: 'Amy Adams' })).rejects.toBeInstanceOf(UnauthorizedError)
      for (const role of ['viewer', 'editor'] as const) {
        await signInAs(await createUser({ role }))
        await expect(createPerson({ name: 'Amy Adams' })).rejects.toBeInstanceOf(ForbiddenError)
      }
      expect(await db.person.count()).toBe(0)
    })

    it('validates the name', async () => {
      await signInAsAdmin()
      await expect(createPerson({ name: '' })).rejects.toMatchObject({
        fieldErrors: { name: ['Name is required'] },
      })
      await expect(createPerson({ name: '!!!' })).rejects.toBeInstanceOf(ValidationError)
    })

    it('creates the person with a slug from the name, numbering namesakes', async () => {
      await signInAsAdmin()
      const first = await createPerson({ name: ' John Williams ' })
      expect(first).toMatchObject({ slug: 'john-williams', name: 'John Williams' })
      expect(first.filmography).toEqual({ directed: [], written: [], acted: [] })
      expect(first.permissions).toEqual({ update: true, delete: true })

      expect((await createPerson({ name: 'John Williams' })).slug).toBe('john-williams-2')
      expect((await createPerson({ name: 'John Williams' })).slug).toBe('john-williams-3')
      // An unrelated slug that merely starts the same way is not in the way.
      expect((await createPerson({ name: 'John Williamson' })).slug).toBe('john-williamson')
    })
  })

  describe('updatePerson', () => {
    it('requires an admin, then a valid id, then an existing person', async () => {
      const amy = await seedPerson('Amy Adams')
      await expect(updatePerson({ id: amy.id, name: 'Amy' })).rejects.toBeInstanceOf(
        UnauthorizedError,
      )
      await signInAs(await createUser({ role: 'editor' }))
      await expect(updatePerson({ id: amy.id, name: 'Amy' })).rejects.toBeInstanceOf(ForbiddenError)
      await signInAsAdmin()
      await expect(updatePerson({ id: 'a b', name: 'Amy' })).rejects.toBeInstanceOf(ValidationError)
      await expect(updatePerson({ id: crypto.randomUUID(), name: 'Amy' })).rejects.toBeInstanceOf(
        NotFoundError,
      )
      expect(await db.person.findUnique({ where: { id: amy.id } })).toMatchObject({
        name: 'Amy Adams',
      })
    })

    it('renames the person and keeps the slug', async () => {
      const amy = await seedPerson('Amy Adams')
      await signInAsAdmin()
      expect(await updatePerson({ id: amy.id, name: 'Amy Lou Adams' })).toMatchObject({
        id: amy.id,
        slug: 'amy-adams',
        name: 'Amy Lou Adams',
      })
    })
  })

  describe('deletePerson', () => {
    it('requires an admin, then a valid id, then an existing person', async () => {
      const amy = await seedPerson('Amy Adams')
      await expect(deletePerson(amy.id)).rejects.toBeInstanceOf(UnauthorizedError)
      await signInAs(await createUser({ role: 'viewer' }))
      await expect(deletePerson(amy.id)).rejects.toBeInstanceOf(ForbiddenError)
      await signInAsAdmin()
      await expect(deletePerson('a b')).rejects.toBeInstanceOf(ValidationError)
      await expect(deletePerson(crypto.randomUUID())).rejects.toBeInstanceOf(NotFoundError)
      expect(await db.person.count()).toBe(1)
    })

    it('refuses to delete a credited person', async () => {
      const amy = await seedPerson('Amy Adams')
      await seedMovie({
        title: 'Arrival',
        releaseDate: '2016-11-11',
        credits: [{ personId: amy.id, role: 'ACTOR' }],
      })
      await signInAsAdmin()
      await expect(deletePerson(amy.id)).rejects.toMatchObject({
        code: 'VALIDATION',
        fieldErrors: { base: ['Remove the person from the credits of 1 movie first'] },
      })
      expect(await db.person.count()).toBe(1)
    })

    it('deletes an uncredited person and forgets the cached detail', async () => {
      const amy = await seedPerson('Amy Adams')
      expect((await getPersonBySlug('amy-adams')).id).toBe(amy.id)
      await signInAsAdmin()
      await deletePerson(amy.id)
      await expect(getPersonBySlug('amy-adams')).rejects.toBeInstanceOf(NotFoundError)
      expect(await db.person.count()).toBe(0)
    })
  })
})
