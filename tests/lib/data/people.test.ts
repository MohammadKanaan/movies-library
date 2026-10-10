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
  attachHeadshot,
  createPerson,
  deletePerson,
  getPersonBySlug,
  getPersonSummaryBySlug,
  listFilmography,
  listPeople,
  removeHeadshot,
  updatePerson,
} from '@/lib/data/people'
import { createReview } from '@/lib/data/reviews'
import { objectDeleteDelaySeconds } from '@/lib/dto/uploads'
import { enqueue } from '@/lib/server/queue'
import { getRedis } from '@/lib/server/redis'
import { deleteObject, headObject } from '@/lib/server/storage'
import { seedGenre, seedMovie, seedPerson, seedReview } from '../../helpers/catalog'
import { createUser, resetDatabase, signInAs, signOut } from '../../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(
  async () => import('../../helpers/cookies'),
)
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

const all = { page: 1, perPage: 10 }

const deleteJobs = () => vi.mocked(enqueue).mock.calls.filter(([name]) => name === 'delete-object')

const headshotKey = (userId: string) => `headshots/${userId}/${crypto.randomUUID()}`

const signInAsAdmin = async () => {
  const admin = await createUser({ role: 'admin' })
  await signInAs(admin)
  return admin
}

describe('people DAL', () => {
  beforeEach(async () => {
    await resetDatabase()
    vi.mocked(enqueue).mockClear()
    vi.mocked(headObject).mockClear()
    vi.mocked(headObject).mockResolvedValue({ size: 4096, contentType: 'image/jpeg' })
    vi.mocked(deleteObject).mockClear()
  })
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
          headshotUrl: null,
          creditCount: 1,
          createdAt: expect.any(Date),
        },
        {
          id: denis.id,
          slug: 'denis-villeneuve',
          name: 'Denis Villeneuve',
          headshotUrl: null,
          creditCount: 3,
          createdAt: expect.any(Date),
        },
      ])
    })

    it('sorts credit counts before pagination and separates cached sort orders', async () => {
      const amy = await seedPerson('Amy Adams')
      const zoe = await seedPerson('Zoe Saldana')
      await seedMovie({
        title: 'Arrival',
        releaseDate: '2016-11-11',
        credits: [{ personId: zoe.id, role: 'ACTOR' }],
      })
      expect((await listPeople({ page: 1, perPage: 1 })).items[0]?.id).toBe(amy.id)
      expect(
        (await listPeople({ page: 1, perPage: 1, sortBy: 'creditCount', direction: 'desc' }))
          .items[0]?.id,
      ).toBe(zoe.id)
      expect(
        (await listPeople({ page: 2, perPage: 1, sortBy: 'creditCount', direction: 'desc' }))
          .items[0]?.id,
      ).toBe(amy.id)
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

    it('returns the profile and how many films they hold each role on', async () => {
      const denis = await db.person.create({
        data: {
          name: 'Denis Villeneuve',
          slug: 'denis-villeneuve',
          bio: 'Canadian filmmaker.',
          birthDate: new Date('1967-10-03T00:00:00.000Z'),
        },
      })
      await seedMovie({
        title: 'Arrival',
        releaseDate: '2016-11-11',
        credits: [{ personId: denis.id, role: 'DIRECTOR' }],
      })
      await seedMovie({
        title: 'Dune',
        releaseDate: '2021-10-22',
        credits: [
          { personId: denis.id, role: 'WRITER' },
          { personId: denis.id, role: 'DIRECTOR' },
        ],
      })

      expect(await getPersonBySlug('denis-villeneuve')).toEqual({
        id: denis.id,
        slug: 'denis-villeneuve',
        name: 'Denis Villeneuve',
        headshotUrl: null,
        bio: 'Canadian filmmaker.',
        birthDate: new Date('1967-10-03T00:00:00.000Z'),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        roleCounts: { DIRECTOR: 2, WRITER: 1, ACTOR: 0 },
        permissions: { update: false, delete: false },
      })
    })

    it('shows a new rating in the cached filmography', async () => {
      const denis = await seedPerson('Denis Villeneuve')
      const dune = await seedMovie({
        title: 'Dune',
        releaseDate: '2021-10-22',
        credits: [{ personId: denis.id, role: 'DIRECTOR' }],
      })
      const ratingOf = async () =>
        (await listFilmography({ personSlug: 'denis-villeneuve' })).items[0]?.rating
      expect(await ratingOf()).toEqual({ average: null, count: 0 })
      await signInAs(await createUser())
      await createReview({ movieId: dune.id, rating: 3.5 })
      expect(await ratingOf()).toEqual({ average: 3.5, count: 1 })
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

  describe('listFilmography', () => {
    const seedFilmography = async () => {
      const scifi = await seedGenre('Science Fiction')
      const denis = await seedPerson('Denis Villeneuve')
      const arrival = await seedMovie({
        title: 'Arrival',
        releaseDate: '2016-11-11',
        credits: [{ personId: denis.id, role: 'DIRECTOR' }],
      })
      // Credited as writer before director: the roles still come out in `credit_role` order.
      const dune = await seedMovie({
        title: 'Dune',
        releaseDate: '2021-10-22',
        runtimeMinutes: 155,
        posterUrl: 'https://pub.example/dune.jpg',
        genreIds: [scifi.id],
        credits: [
          { personId: denis.id, role: 'WRITER' },
          { personId: denis.id, role: 'DIRECTOR' },
        ],
      })
      return { scifi, denis, arrival, dune }
    }

    it('is public and answers not found for an unknown or malformed slug', async () => {
      await expect(listFilmography({ personSlug: 'nobody' })).rejects.toBeInstanceOf(NotFoundError)
      await expect(listFilmography({ personSlug: 'Not A Slug' })).rejects.toBeInstanceOf(
        NotFoundError,
      )
    })

    it('lists each film once with every role held on it, newest release first', async () => {
      const { scifi, arrival, dune } = await seedFilmography()
      await seedReview({ movieId: dune.id, authorId: (await createUser()).id, rating: 4.5 })
      expect(await listFilmography({ personSlug: 'denis-villeneuve' })).toEqual({
        items: [
          {
            id: dune.id,
            slug: 'dune-2021',
            title: 'Dune',
            releaseDate: new Date('2021-10-22T00:00:00.000Z'),
            runtimeMinutes: 155,
            posterUrl: 'https://pub.example/dune.jpg',
            genres: [{ id: scifi.id, name: 'Science Fiction', slug: 'science-fiction' }],
            rating: { average: 4.5, count: 1 },
            roles: ['DIRECTOR', 'WRITER'],
          },
          {
            id: arrival.id,
            slug: 'arrival-2016',
            title: 'Arrival',
            releaseDate: new Date('2016-11-11T00:00:00.000Z'),
            runtimeMinutes: null,
            posterUrl: null,
            genres: [],
            rating: { average: null, count: 0 },
            roles: ['DIRECTOR'],
          },
        ],
        page: 1,
        perPage: 10,
        totalItems: 2,
        totalPages: 1,
      })
    })

    it('pages by film, not by credit', async () => {
      const { arrival } = await seedFilmography()
      const second = await listFilmography({ personSlug: 'denis-villeneuve', page: 2, perPage: 1 })
      expect(second).toMatchObject({ page: 2, perPage: 1, totalItems: 2, totalPages: 2 })
      expect(second.items.map((movie) => movie.id)).toEqual([arrival.id])
      expect(
        (await listFilmography({ personSlug: 'denis-villeneuve', page: 3, perPage: 1 })).items,
      ).toEqual([])
    })

    it('is cached until a catalog write invalidates it', async () => {
      const { denis, dune } = await seedFilmography()
      const titles = async () =>
        (await listFilmography({ personSlug: 'denis-villeneuve' })).items.map(
          (movie) => movie.title,
        )
      expect(await titles()).toEqual(['Dune', 'Arrival'])
      await db.movie.update({ where: { id: dune.id }, data: { title: 'Dune: Part One' } })
      expect(await titles()).toEqual(['Dune', 'Arrival'])

      await signInAsAdmin()
      await updatePerson({ id: denis.id, name: 'Denis Villeneuve' })
      signOut()
      expect(await titles()).toEqual(['Dune: Part One', 'Arrival'])
    })
  })

  describe('getPersonSummaryBySlug', () => {
    it('is public and returns the summary alone, not found for an unknown or malformed slug', async () => {
      const amy = await seedPerson('Amy Adams')
      await seedMovie({
        title: 'Arrival',
        releaseDate: '2016-11-11',
        credits: [{ personId: amy.id, role: 'ACTOR' }],
      })
      expect(await getPersonSummaryBySlug('amy-adams')).toEqual({
        id: amy.id,
        slug: 'amy-adams',
        name: 'Amy Adams',
        headshotUrl: null,
      })
      await expect(getPersonSummaryBySlug('nobody')).rejects.toBeInstanceOf(NotFoundError)
      await expect(getPersonSummaryBySlug('Not A Slug')).rejects.toBeInstanceOf(NotFoundError)
    })

    it('is cached until a catalog write invalidates it', async () => {
      const amy = await seedPerson('Amy Adams')
      expect((await getPersonSummaryBySlug('amy-adams')).name).toBe('Amy Adams')
      await db.person.update({ where: { id: amy.id }, data: { name: 'Amy Lou Adams' } })
      expect((await getPersonSummaryBySlug('amy-adams')).name).toBe('Amy Adams')

      await signInAsAdmin()
      await updatePerson({ id: amy.id, name: 'Amy Lou Adams' })
      signOut()
      expect((await getPersonSummaryBySlug('amy-adams')).name).toBe('Amy Lou Adams')
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
      expect(first.roleCounts).toEqual({ DIRECTOR: 0, WRITER: 0, ACTOR: 0 })
      expect(first).toMatchObject({ bio: null, birthDate: null, headshotUrl: null })
      expect(first.permissions).toEqual({ update: true, delete: true })

      expect((await createPerson({ name: 'John Williams' })).slug).toBe('john-williams-2')
      expect((await createPerson({ name: 'John Williams' })).slug).toBe('john-williams-3')
      // An unrelated slug that merely starts the same way is not in the way.
      expect((await createPerson({ name: 'John Williamson' })).slug).toBe('john-williamson')
    })

    it('stores the bio and birth date', async () => {
      await signInAsAdmin()
      expect(
        await createPerson({
          name: 'Greta Gerwig',
          bio: ' Writer and director. ',
          birthDate: '1983-08-04',
        }),
      ).toMatchObject({
        bio: 'Writer and director.',
        birthDate: new Date('1983-08-04T00:00:00.000Z'),
      })
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

    it('keeps the bio and birth date on a rename, and clears them with null', async () => {
      const amy = await seedPerson('Amy Adams')
      await signInAsAdmin()
      await updatePerson({ id: amy.id, name: 'Amy Adams', bio: 'Actor.', birthDate: '1974-08-20' })

      expect(await updatePerson({ id: amy.id, name: 'Amy Lou Adams' })).toMatchObject({
        bio: 'Actor.',
        birthDate: new Date('1974-08-20T00:00:00.000Z'),
      })
      expect(
        await updatePerson({ id: amy.id, name: 'Amy', bio: '', birthDate: null }),
      ).toMatchObject({ bio: null, birthDate: null })
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

    it('reports a credit added between the count and the delete as a field error', async () => {
      const amy = await seedPerson('Amy Adams')
      await seedMovie({
        title: 'Arrival',
        releaseDate: '2016-11-11',
        credits: [{ personId: amy.id, role: 'ACTOR' }],
      })
      await signInAsAdmin()
      // A stale count of zero stands in for a credit written right after the DAL's own count.
      vi.spyOn(db.movie, 'count').mockResolvedValueOnce(0)
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
      expect(deleteJobs()).toHaveLength(0)
    })

    it('queues the headshot object for deletion when it is in the bucket', async () => {
      const admin = await signInAsAdmin()
      const key = headshotKey(admin.id)
      const amy = await db.person.create({
        data: { name: 'Amy Adams', slug: 'amy-adams', headshotUrl: `${BUCKET_URL}${key}` },
      })
      await deletePerson(amy.id)
      expect(deleteJobs()).toEqual([
        ['delete-object', { key }, { startAfter: objectDeleteDelaySeconds('headshot') }],
      ])
    })
  })

  describe('attachHeadshot', () => {
    const headshotOf = async (id: string) =>
      (await db.person.findUniqueOrThrow({ where: { id } })).headshotUrl

    it('checks admin, then the key, then ownership, then the person, then the object', async () => {
      const amy = await seedPerson('Amy Adams')
      const otherAdmin = await createUser({ role: 'admin' })
      const theirKey = headshotKey(otherAdmin.id)

      await expect(attachHeadshot({ id: amy.id, key: 'nope' })).rejects.toBeInstanceOf(
        UnauthorizedError,
      )
      await signInAs(await createUser({ role: 'editor' }))
      await expect(attachHeadshot({ id: amy.id, key: theirKey })).rejects.toBeInstanceOf(
        ForbiddenError,
      )

      const admin = await signInAsAdmin()
      await expect(attachHeadshot({ id: amy.id, key: 'nope' })).rejects.toBeInstanceOf(
        ValidationError,
      )
      await expect(attachHeadshot({ id: amy.id, key: theirKey })).rejects.toBeInstanceOf(
        ForbiddenError,
      )
      // A poster under this admin's own id is still not a headshot.
      await expect(
        attachHeadshot({ id: amy.id, key: `posters/${admin.id}/${crypto.randomUUID()}` }),
      ).rejects.toBeInstanceOf(ForbiddenError)
      await expect(
        attachHeadshot({ id: crypto.randomUUID(), key: headshotKey(admin.id) }),
      ).rejects.toBeInstanceOf(NotFoundError)
      expect(headObject).not.toHaveBeenCalled()

      vi.mocked(headObject).mockResolvedValueOnce(null)
      await expect(
        attachHeadshot({ id: amy.id, key: headshotKey(admin.id) }),
      ).rejects.toMatchObject({ fieldErrors: { key: ['The file was not uploaded'] } })
      expect(await headshotOf(amy.id)).toBeNull()
    })

    it('rejects an object that breaks the headshot rule and deletes it at once', async () => {
      const amy = await seedPerson('Amy Adams')
      const admin = await signInAsAdmin()
      const key = headshotKey(admin.id)
      vi.mocked(headObject).mockResolvedValueOnce({
        size: 3 * 1024 * 1024,
        contentType: 'image/jpeg',
      })
      await expect(attachHeadshot({ id: amy.id, key })).rejects.toBeInstanceOf(ValidationError)
      expect(deleteObject).toHaveBeenCalledWith(key)
      expect(await headshotOf(amy.id)).toBeNull()
    })

    it('sets the headshot to the public URL, shown on the detail and in the list', async () => {
      const amy = await seedPerson('Amy Adams')
      const admin = await signInAsAdmin()
      const key = headshotKey(admin.id)

      const person = await attachHeadshot({ id: amy.id, key })

      expect(person.headshotUrl).toBe(`${BUCKET_URL}${key}`)
      expect(headObject).toHaveBeenCalledWith(key)
      expect(deleteJobs()).toHaveLength(0)
      signOut()
      expect((await getPersonBySlug('amy-adams')).headshotUrl).toBe(person.headshotUrl)
      expect((await listPeople(all)).items[0]?.headshotUrl).toBe(person.headshotUrl)
    })

    it('queues the replaced headshot, unless it is the same object', async () => {
      const amy = await seedPerson('Amy Adams')
      const admin = await signInAsAdmin()
      const first = headshotKey(admin.id)
      const second = headshotKey(admin.id)

      await attachHeadshot({ id: amy.id, key: first })
      await attachHeadshot({ id: amy.id, key: first })
      expect(deleteJobs()).toHaveLength(0)
      await attachHeadshot({ id: amy.id, key: second })
      expect(deleteJobs()).toEqual([
        ['delete-object', { key: first }, { startAfter: objectDeleteDelaySeconds('headshot') }],
      ])
    })
  })

  describe('removeHeadshot', () => {
    it('requires an admin, then a valid id, then an existing person', async () => {
      const amy = await seedPerson('Amy Adams')
      await expect(removeHeadshot(amy.id)).rejects.toBeInstanceOf(UnauthorizedError)
      await signInAs(await createUser({ role: 'editor' }))
      await expect(removeHeadshot(amy.id)).rejects.toBeInstanceOf(ForbiddenError)
      await signInAsAdmin()
      await expect(removeHeadshot('a b')).rejects.toBeInstanceOf(ValidationError)
      await expect(removeHeadshot(crypto.randomUUID())).rejects.toBeInstanceOf(NotFoundError)
    })

    it('clears the headshot and queues its object, or nothing when there was none', async () => {
      const admin = await signInAsAdmin()
      const key = headshotKey(admin.id)
      const amy = await db.person.create({
        data: { name: 'Amy Adams', slug: 'amy-adams', headshotUrl: `${BUCKET_URL}${key}` },
      })
      const bare = await seedPerson('Zendaya')

      expect((await removeHeadshot(amy.id)).headshotUrl).toBeNull()
      expect((await removeHeadshot(bare.id)).headshotUrl).toBeNull()

      expect(deleteJobs()).toEqual([
        ['delete-object', { key }, { startAfter: objectDeleteDelaySeconds('headshot') }],
      ])
    })
  })
})
