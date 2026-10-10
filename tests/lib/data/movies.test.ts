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
  attachPoster,
  createMovie,
  deleteMovie,
  getMovieBySlug,
  listMovies,
  removePoster,
  updateMovie,
} from '@/lib/data/movies'
import type { MovieInput, MovieSort } from '@/lib/dto/movies'
import { objectDeleteDelaySeconds } from '@/lib/dto/uploads'
import { enqueue } from '@/lib/server/queue'
import { getRedis } from '@/lib/server/redis'
import { deleteObject, headObject } from '@/lib/server/storage'
import { seedGenre, seedMovie, seedPerson } from '../../helpers/catalog'
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

const deleteJobs = () => vi.mocked(enqueue).mock.calls.filter(([name]) => name === 'delete-object')

const posterKey = (userId: string) => `posters/${userId}/${crypto.randomUUID()}`

const signInAsAdmin = async () => {
  const admin = await createUser({ role: 'admin' })
  await signInAs(admin)
  return admin
}

/** Three people, two genres and the input of a complete movie that uses them. */
const fixtures = async () => {
  const denis = await seedPerson('Denis Villeneuve')
  const timothee = await seedPerson('Timothée Chalamet')
  const zendaya = await seedPerson('Zendaya')
  const scifi = await seedGenre('Science Fiction')
  const adventure = await seedGenre('Adventure')
  const input: MovieInput = {
    title: 'Dune',
    synopsis: 'Paul Atreides travels to Arrakis.',
    releaseDate: '2021-10-22',
    runtimeMinutes: 155,
    genreIds: [scifi.id, adventure.id],
    credits: [
      { personId: timothee.id, role: 'ACTOR' },
      { personId: denis.id, role: 'DIRECTOR' },
      { personId: zendaya.id, role: 'ACTOR', star: true },
      { personId: denis.id, role: 'WRITER' },
    ],
  }
  return { denis, timothee, zendaya, scifi, adventure, input }
}

describe('movies DAL', () => {
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

  describe('listMovies', () => {
    it('is public and lists summaries newest first, ids breaking ties', async () => {
      const scifi = await seedGenre('Science Fiction')
      const drama = await seedGenre('Drama')
      const arrival = await seedMovie({
        title: 'Arrival',
        releaseDate: '2016-11-11',
        runtimeMinutes: 116,
        genreIds: [scifi.id, drama.id],
      })
      const dune = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const other = await seedMovie({
        title: 'The French Dispatch',
        releaseDate: '2021-10-22',
        posterUrl: 'https://pub.example/dispatch.jpg',
      })

      const page = await listMovies({})
      expect(page).toMatchObject({ page: 1, perPage: 10, totalItems: 3, totalPages: 1 })
      // Same release date: the later id (UUIDv7, so the later insert) first.
      expect(page.items.map((movie) => movie.id)).toEqual([other.id, dune.id, arrival.id])
      expect(page.items[2]).toEqual({
        id: arrival.id,
        slug: 'arrival-2016',
        title: 'Arrival',
        releaseDate: new Date('2016-11-11T00:00:00.000Z'),
        runtimeMinutes: 116,
        posterUrl: null,
        genres: [
          { id: drama.id, name: 'Drama', slug: 'drama' },
          { id: scifi.id, name: 'Science Fiction', slug: 'science-fiction' },
        ],
      })
      expect(page.items[0]).toMatchObject({ posterUrl: 'https://pub.example/dispatch.jpg' })
    })

    it('validates the query', async () => {
      await expect(listMovies({ page: 0 })).rejects.toBeInstanceOf(ValidationError)
      await expect(listMovies({ q: 'a'.repeat(101) })).rejects.toBeInstanceOf(ValidationError)
      // The trigram index cannot serve fewer than three characters.
      await expect(listMovies({ q: 'du' })).rejects.toBeInstanceOf(ValidationError)
      await expect(listMovies({ genres: ['Sci Fi'] })).rejects.toBeInstanceOf(ValidationError)
      await expect(listMovies({ sort: 'rating' as never })).rejects.toBeInstanceOf(ValidationError)
    })

    it('sorts oldest first, by title, and by when the movie was added', async () => {
      await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      await seedMovie({ title: 'Arrival', releaseDate: '2016-11-11' })
      await seedMovie({ title: 'Blade Runner 2049', releaseDate: '2017-10-06' })
      const titles = async (sort: MovieSort) =>
        (await listMovies({ sort })).items.map((movie) => movie.title)
      expect(await titles('oldest')).toEqual(['Arrival', 'Blade Runner 2049', 'Dune'])
      expect(await titles('title')).toEqual(['Arrival', 'Blade Runner 2049', 'Dune'])
      expect(await titles('newest')).toEqual(['Dune', 'Blade Runner 2049', 'Arrival'])
      // Insertion order reversed, whatever the release dates say.
      expect(await titles('added')).toEqual(['Blade Runner 2049', 'Arrival', 'Dune'])
    })

    it('searches the title case-insensitively and treats wildcards literally', async () => {
      await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      await seedMovie({ title: 'Dune: Part Two', releaseDate: '2024-03-01' })
      await seedMovie({ title: '100% Wolf', releaseDate: '2020-05-29' })
      const titles = async (q: string) => (await listMovies({ q })).items.map((m) => m.title)
      expect(await titles('DUNE')).toEqual(['Dune: Part Two', 'Dune'])
      expect(await titles('part')).toEqual(['Dune: Part Two'])
      expect(await titles('100%')).toEqual(['100% Wolf'])
      // `_` would match any character ("Dune"); literally it matches nothing here.
      expect(await titles('d_ne')).toEqual([])
      expect(await titles('   ')).toHaveLength(3)
    })

    it('filters by genre slugs and by person slug, together with the search', async () => {
      const scifi = await seedGenre('Science Fiction')
      const drama = await seedGenre('Drama')
      const denis = await seedPerson('Denis Villeneuve')
      const amy = await seedPerson('Amy Adams')
      await seedMovie({
        title: 'Arrival',
        releaseDate: '2016-11-11',
        genreIds: [scifi.id, drama.id],
        credits: [
          { personId: denis.id, role: 'DIRECTOR' },
          { personId: amy.id, role: 'ACTOR' },
        ],
      })
      await seedMovie({
        title: 'Dune',
        releaseDate: '2021-10-22',
        genreIds: [scifi.id],
        credits: [{ personId: denis.id, role: 'DIRECTOR' }],
      })
      await seedMovie({
        title: 'Nocturnal Animals',
        releaseDate: '2016-11-18',
        genreIds: [drama.id],
        credits: [{ personId: amy.id, role: 'ACTOR' }],
      })
      const titles = async (query: Parameters<typeof listMovies>[0]) =>
        (await listMovies(query)).items.map((m) => m.title)
      expect(await titles({ genres: ['science-fiction'] })).toEqual(['Dune', 'Arrival'])
      expect(await titles({ person: 'amy-adams' })).toEqual(['Nocturnal Animals', 'Arrival'])
      expect(await titles({ genres: ['drama'], person: 'denis-villeneuve' })).toEqual(['Arrival'])
      expect(await titles({ genres: ['drama'], q: 'noct' })).toEqual(['Nocturnal Animals'])
      expect(await titles({ genres: ['horror'] })).toEqual([])
      expect((await listMovies({ person: 'nobody' })).totalItems).toBe(0)
    })

    it('needs every genre named, not any of them', async () => {
      const scifi = await seedGenre('Science Fiction')
      const drama = await seedGenre('Drama')
      await seedMovie({
        title: 'Arrival',
        releaseDate: '2016-11-11',
        genreIds: [scifi.id, drama.id],
      })
      await seedMovie({ title: 'Dune', releaseDate: '2021-10-22', genreIds: [scifi.id] })
      await seedMovie({ title: 'Heat', releaseDate: '1995-12-15', genreIds: [drama.id] })
      const titles = async (genres: string[]) =>
        (await listMovies({ genres })).items.map((m) => m.title)
      expect(await titles(['science-fiction'])).toEqual(['Dune', 'Arrival'])
      expect(await titles(['drama'])).toEqual(['Arrival', 'Heat'])
      expect(await titles(['science-fiction', 'drama'])).toEqual(['Arrival'])
      expect(await titles([])).toHaveLength(3)
    })

    it('filters by release year range and runtime range, open at either end', async () => {
      await seedMovie({ title: 'Heat', releaseDate: '1995-12-15', runtimeMinutes: 170 })
      await seedMovie({ title: 'Arrival', releaseDate: '2016-11-11', runtimeMinutes: 116 })
      await seedMovie({ title: 'Dune', releaseDate: '2021-10-22', runtimeMinutes: 155 })
      await seedMovie({ title: 'Short', releaseDate: '2021-01-01', runtimeMinutes: null })
      const titles = async (query: Parameters<typeof listMovies>[0]) =>
        (await listMovies(query)).items.map((m) => m.title)
      // Year bounds take the whole calendar year, both ends included.
      expect(await titles({ yearFrom: 2016, yearTo: 2021 })).toEqual(['Dune', 'Short', 'Arrival'])
      expect(await titles({ yearFrom: 1995, yearTo: 1995 })).toEqual(['Heat'])
      expect(await titles({ yearFrom: 2021 })).toEqual(['Dune', 'Short'])
      expect(await titles({ yearTo: 2016 })).toEqual(['Arrival', 'Heat'])
      // A movie without a runtime is never within a runtime range.
      expect(await titles({ runtimeMin: 150 })).toEqual(['Dune', 'Heat'])
      expect(await titles({ runtimeMax: 155 })).toEqual(['Dune', 'Arrival'])
      expect(await titles({ runtimeMin: 116, runtimeMax: 116 })).toEqual(['Arrival'])
      expect(await titles({ yearFrom: 2000, runtimeMax: 120 })).toEqual(['Arrival'])
    })

    it('refuses a reversed range and an impossible year as validation errors', async () => {
      await expect(listMovies({ yearFrom: 2010, yearTo: 2000 })).rejects.toMatchObject({
        fieldErrors: { yearTo: ['The last year is before the first'] },
      })
      await expect(listMovies({ runtimeMin: 120, runtimeMax: 90 })).rejects.toBeInstanceOf(
        ValidationError,
      )
      await expect(listMovies({ yearFrom: 1800 })).rejects.toBeInstanceOf(ValidationError)
      await expect(listMovies({ runtimeMax: 0 })).rejects.toBeInstanceOf(ValidationError)
    })

    it('paginates', async () => {
      for (const year of [2010, 2011, 2012, 2013, 2014]) {
        await seedMovie({ title: `Film ${year}`, releaseDate: `${year}-01-01` })
      }
      const first = await listMovies({ page: 1, perPage: 2 })
      const third = await listMovies({ page: 3, perPage: 2 })
      expect(first).toMatchObject({ totalItems: 5, totalPages: 3 })
      expect(first.items.map((m) => m.title)).toEqual(['Film 2014', 'Film 2013'])
      expect(third.items.map((m) => m.title)).toEqual(['Film 2010'])
    })

    it('caches the plain list but never a searched or filtered one', async () => {
      const { input, scifi } = await fixtures()
      await seedMovie({ title: 'Dune', releaseDate: '2021-10-22', genreIds: [scifi.id] })
      expect((await listMovies({})).totalItems).toBe(1)
      expect((await listMovies({ genres: ['science-fiction'] })).totalItems).toBe(1)
      await seedMovie({ title: 'Arrival', releaseDate: '2016-11-11', genreIds: [scifi.id] })
      expect((await listMovies({})).totalItems).toBe(1)
      expect((await listMovies({ genres: ['science-fiction'] })).totalItems).toBe(2)
      expect((await listMovies({ q: 'arr' })).totalItems).toBe(1)
      expect((await listMovies({ yearFrom: 2020 })).totalItems).toBe(1)
      expect((await listMovies({ runtimeMax: 500 })).totalItems).toBe(0)

      await signInAsAdmin()
      await createMovie(input)
      expect((await listMovies({})).totalItems).toBe(3)
    })
  })

  describe('getMovieBySlug', () => {
    it('is public and answers not found for an unknown or malformed slug', async () => {
      await expect(getMovieBySlug('nothing-2000')).rejects.toBeInstanceOf(NotFoundError)
      await expect(getMovieBySlug('Dune 2021')).rejects.toBeInstanceOf(NotFoundError)
      await expect(getMovieBySlug('')).rejects.toBeInstanceOf(NotFoundError)
    })

    it('returns the full detail with credits grouped by role in billing order', async () => {
      const admin = await createUser({ name: 'Ada Admin', username: 'ada', role: 'admin' })
      const { denis, timothee, zendaya, scifi, adventure } = await fixtures()
      const movie = await seedMovie({
        title: 'Dune',
        releaseDate: '2021-10-22',
        synopsis: 'Paul Atreides travels to Arrakis.',
        runtimeMinutes: 155,
        createdById: admin.id,
        genreIds: [scifi.id, adventure.id],
        credits: [
          { personId: zendaya.id, role: 'ACTOR', position: 1, star: true },
          { personId: denis.id, role: 'WRITER', position: 0 },
          { personId: timothee.id, role: 'ACTOR', position: 0 },
          { personId: denis.id, role: 'DIRECTOR', position: 0 },
        ],
      })

      expect(await getMovieBySlug('dune-2021')).toEqual({
        id: movie.id,
        slug: 'dune-2021',
        title: 'Dune',
        synopsis: 'Paul Atreides travels to Arrakis.',
        releaseDate: new Date('2021-10-22T00:00:00.000Z'),
        runtimeMinutes: 155,
        posterUrl: null,
        genres: [
          { id: adventure.id, name: 'Adventure', slug: 'adventure' },
          { id: scifi.id, name: 'Science Fiction', slug: 'science-fiction' },
        ],
        createdBy: { id: admin.id, name: 'Ada Admin', username: 'ada' },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        credits: {
          directors: [
            { id: denis.id, slug: 'denis-villeneuve', name: 'Denis Villeneuve', headshotUrl: null },
          ],
          writers: [
            { id: denis.id, slug: 'denis-villeneuve', name: 'Denis Villeneuve', headshotUrl: null },
          ],
          cast: [
            {
              id: timothee.id,
              slug: 'timothee-chalamet',
              name: 'Timothée Chalamet',
              headshotUrl: null,
              star: false,
            },
            { id: zendaya.id, slug: 'zendaya', name: 'Zendaya', headshotUrl: null, star: true },
          ],
        },
        permissions: { update: false, delete: false },
      })
    })

    it('has no creator once that account is gone', async () => {
      await seedMovie({ title: 'Dune', releaseDate: '2021-10-22', createdById: null })
      expect((await getMovieBySlug('dune-2021')).createdBy).toBeNull()
    })

    it('computes the permissions for the viewer on top of the cached record', async () => {
      await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      expect((await getMovieBySlug('dune-2021')).permissions).toEqual({
        update: false,
        delete: false,
      })
      await signInAs(await createUser({ role: 'editor' }))
      expect((await getMovieBySlug('dune-2021')).permissions).toEqual({
        update: false,
        delete: false,
      })
      await signInAsAdmin()
      expect((await getMovieBySlug('dune-2021')).permissions).toEqual({
        update: true,
        delete: true,
      })
    })

    it('is cached until a catalog write invalidates it', async () => {
      const dune = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      expect((await getMovieBySlug('dune-2021')).runtimeMinutes).toBeNull()
      await db.movie.update({ where: { id: dune.id }, data: { runtimeMinutes: 155 } })
      expect((await getMovieBySlug('dune-2021')).runtimeMinutes).toBeNull()

      await signInAsAdmin()
      await updateMovie({
        id: dune.id,
        title: 'Dune',
        releaseDate: '2021-10-22',
        runtimeMinutes: 156,
        genreIds: [],
        credits: [],
      })
      signOut()
      expect((await getMovieBySlug('dune-2021')).runtimeMinutes).toBe(156)
    })
  })

  describe('createMovie', () => {
    it('requires an admin: 401 signed out, 403 for a viewer or an editor', async () => {
      const { input } = await fixtures()
      await expect(createMovie(input)).rejects.toBeInstanceOf(UnauthorizedError)
      for (const role of ['viewer', 'editor'] as const) {
        await signInAs(await createUser({ role }))
        await expect(createMovie(input)).rejects.toBeInstanceOf(ForbiddenError)
      }
      expect(await db.movie.count()).toBe(0)
    })

    it('validates the input', async () => {
      const { input } = await fixtures()
      await signInAsAdmin()
      const error = await createMovie({ ...input, title: ' ', releaseDate: 'soon' }).catch(
        (caught: unknown) => caught,
      )
      expect(error).toBeInstanceOf(ValidationError)
      expect(Object.keys((error as ValidationError).fieldErrors ?? {}).sort()).toEqual([
        'releaseDate',
        'title',
      ])
      expect(await db.movie.count()).toBe(0)
    })

    it('refuses unknown genres and people as field errors', async () => {
      const { input } = await fixtures()
      await signInAsAdmin()
      await expect(
        createMovie({ ...input, genreIds: [...input.genreIds, crypto.randomUUID()] }),
      ).rejects.toMatchObject({ fieldErrors: { genreIds: ['A genre does not exist'] } })
      await expect(
        createMovie({
          ...input,
          credits: [...input.credits, { personId: crypto.randomUUID(), role: 'ACTOR' }],
        }),
      ).rejects.toMatchObject({ fieldErrors: { credits: ['A person does not exist'] } })
      expect(await db.movie.count()).toBe(0)
    })

    it('creates the movie, its genres and its credits, numbered per role in the given order', async () => {
      const admin = await signInAsAdmin()
      const { input, denis, timothee, zendaya, scifi, adventure } = await fixtures()

      const movie = await createMovie(input)

      expect(movie).toMatchObject({
        slug: 'dune-2021',
        title: 'Dune',
        synopsis: 'Paul Atreides travels to Arrakis.',
        releaseDate: new Date('2021-10-22T00:00:00.000Z'),
        runtimeMinutes: 155,
        posterUrl: null,
        createdBy: { id: admin.id },
        permissions: { update: true, delete: true },
      })
      expect(movie.genres.map((genre) => genre.id)).toEqual([adventure.id, scifi.id])
      expect(movie.credits).toEqual({
        directors: [expect.objectContaining({ id: denis.id })],
        writers: [expect.objectContaining({ id: denis.id })],
        cast: [
          expect.objectContaining({ id: timothee.id, star: false }),
          expect.objectContaining({ id: zendaya.id, star: true }),
        ],
      })
      const rows = await db.credit.findMany({
        where: { movieId: movie.id },
        orderBy: [{ role: 'asc' }, { position: 'asc' }],
      })
      expect(rows.map((row) => [row.role, row.personId, row.position, row.star])).toEqual([
        ['DIRECTOR', denis.id, 0, false],
        ['WRITER', denis.id, 0, false],
        ['ACTOR', timothee.id, 0, false],
        ['ACTOR', zendaya.id, 1, true],
      ])
      expect(await db.movie.findUnique({ where: { id: movie.id } })).toMatchObject({
        createdById: admin.id,
      })
    })

    it('stores a blank synopsis and a missing runtime as null, and keeps the calendar day', async () => {
      await signInAsAdmin()
      const { input } = await fixtures()
      const movie = await createMovie({
        ...input,
        synopsis: '  ',
        runtimeMinutes: undefined,
        releaseDate: '1999-12-31',
      })
      expect(movie).toMatchObject({
        synopsis: null,
        runtimeMinutes: null,
        releaseDate: new Date('1999-12-31T00:00:00.000Z'),
        slug: 'dune-1999',
      })
    })

    it('numbers the slug when a movie with the same title and year exists', async () => {
      await signInAsAdmin()
      const { input } = await fixtures()
      expect((await createMovie({ ...input, releaseDate: '1984-12-14' })).slug).toBe('dune-1984')
      expect((await createMovie(input)).slug).toBe('dune-2021')
      expect((await createMovie(input)).slug).toBe('dune-2021-2')
      expect((await createMovie(input)).slug).toBe('dune-2021-3')
    })
  })

  describe('updateMovie', () => {
    it('requires an admin, then a valid id, then an existing movie', async () => {
      const { input } = await fixtures()
      const dune = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const update = { ...input, id: dune.id, title: 'Dune: Part One' }
      await expect(updateMovie(update)).rejects.toBeInstanceOf(UnauthorizedError)
      await signInAs(await createUser({ role: 'editor' }))
      await expect(updateMovie(update)).rejects.toBeInstanceOf(ForbiddenError)
      await signInAsAdmin()
      await expect(updateMovie({ ...update, id: 'a b' })).rejects.toBeInstanceOf(ValidationError)
      await expect(updateMovie({ ...update, id: crypto.randomUUID() })).rejects.toBeInstanceOf(
        NotFoundError,
      )
      expect(await db.movie.findUnique({ where: { id: dune.id } })).toMatchObject({
        title: 'Dune',
      })
    })

    it('replaces the fields, genres and credits and keeps the slug', async () => {
      const { input, denis, zendaya, scifi, adventure } = await fixtures()
      const drama = await seedGenre('Drama')
      const dune = await seedMovie({
        title: 'Dune',
        releaseDate: '2021-10-22',
        genreIds: [drama.id],
        credits: [{ personId: zendaya.id, role: 'DIRECTOR' }],
      })
      await signInAsAdmin()

      const updated = await updateMovie({
        ...input,
        id: dune.id,
        title: 'Dune: Part One',
        releaseDate: '2021-09-03',
        credits: [
          { personId: zendaya.id, role: 'ACTOR' },
          { personId: denis.id, role: 'DIRECTOR' },
        ],
      })

      expect(updated).toMatchObject({
        id: dune.id,
        slug: 'dune-2021',
        title: 'Dune: Part One',
        releaseDate: new Date('2021-09-03T00:00:00.000Z'),
      })
      expect(updated.genres.map((genre) => genre.id)).toEqual([adventure.id, scifi.id])
      expect(updated.credits).toEqual({
        directors: [expect.objectContaining({ id: denis.id })],
        writers: [],
        cast: [expect.objectContaining({ id: zendaya.id, star: false })],
      })
      expect(await db.credit.count({ where: { movieId: dune.id } })).toBe(2)
      expect(await db.movieGenre.count({ where: { movieId: dune.id } })).toBe(2)
    })

    it('stars and unstars cast members', async () => {
      const { input, timothee, zendaya } = await fixtures()
      await signInAsAdmin()
      const dune = await createMovie(input)

      const updated = await updateMovie({
        ...input,
        id: dune.id,
        credits: [
          { personId: timothee.id, role: 'ACTOR', star: true },
          { personId: zendaya.id, role: 'ACTOR' },
        ],
      })

      expect(updated.credits.cast.map(({ id, star }) => [id, star])).toEqual([
        [timothee.id, true],
        [zendaya.id, false],
      ])
      expect((await getMovieBySlug(dune.slug)).credits.cast).toEqual(updated.credits.cast)
    })

    it('refuses a star outside the cast', async () => {
      const { input, denis } = await fixtures()
      await signInAsAdmin()
      const dune = await createMovie(input)

      const error = await updateMovie({
        ...input,
        id: dune.id,
        credits: [{ personId: denis.id, role: 'DIRECTOR', star: true }],
      }).catch((caught: unknown) => caught)

      expect(error).toBeInstanceOf(ValidationError)
      expect(error).toMatchObject({ fieldErrors: { credits: ['Only cast members can be stars'] } })
      // The table refuses it too (`credits_star_cast_only`).
      await expect(
        db.credit.create({
          data: { movieId: dune.id, personId: denis.id, role: 'WRITER', star: true },
        }),
      ).rejects.toThrow()
    })

    it('refuses unknown genres and people without changing anything', async () => {
      const { input } = await fixtures()
      const drama = await seedGenre('Drama')
      const dune = await seedMovie({
        title: 'Dune',
        releaseDate: '2021-10-22',
        genreIds: [drama.id],
      })
      await signInAsAdmin()
      await expect(
        updateMovie({ ...input, id: dune.id, genreIds: [crypto.randomUUID()] }),
      ).rejects.toMatchObject({ fieldErrors: { genreIds: ['A genre does not exist'] } })
      expect(await db.movieGenre.findMany({ where: { movieId: dune.id } })).toHaveLength(1)
    })
  })

  describe('deleteMovie', () => {
    it('requires an admin, then a valid id, then an existing movie', async () => {
      const dune = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      await expect(deleteMovie(dune.id)).rejects.toBeInstanceOf(UnauthorizedError)
      await signInAs(await createUser({ role: 'viewer' }))
      await expect(deleteMovie(dune.id)).rejects.toBeInstanceOf(ForbiddenError)
      await signInAsAdmin()
      await expect(deleteMovie('a b')).rejects.toBeInstanceOf(ValidationError)
      await expect(deleteMovie(crypto.randomUUID())).rejects.toBeInstanceOf(NotFoundError)
      expect(await db.movie.count()).toBe(1)
    })

    it('deletes the movie with its links, keeps the people and genres, and forgets the cache', async () => {
      const { denis, scifi } = await fixtures()
      const dune = await seedMovie({
        title: 'Dune',
        releaseDate: '2021-10-22',
        genreIds: [scifi.id],
        credits: [{ personId: denis.id, role: 'DIRECTOR' }],
      })
      expect((await getMovieBySlug('dune-2021')).id).toBe(dune.id)
      await signInAsAdmin()

      await deleteMovie(dune.id)

      expect(await db.movie.count()).toBe(0)
      expect(await db.credit.count()).toBe(0)
      expect(await db.movieGenre.count()).toBe(0)
      expect(await db.person.count({ where: { id: denis.id } })).toBe(1)
      expect(await db.genre.count({ where: { id: scifi.id } })).toBe(1)
      await expect(getMovieBySlug('dune-2021')).rejects.toBeInstanceOf(NotFoundError)
      expect(deleteJobs()).toHaveLength(0)
    })

    it('queues the poster object for deletion when the poster is in the bucket', async () => {
      const admin = await signInAsAdmin()
      const key = posterKey(admin.id)
      const dune = await seedMovie({
        title: 'Dune',
        releaseDate: '2021-10-22',
        posterUrl: `${BUCKET_URL}${key}`,
      })
      const other = await seedMovie({
        title: 'Arrival',
        releaseDate: '2016-11-11',
        posterUrl: 'https://image.tmdb.org/arrival.jpg',
      })

      await deleteMovie(dune.id)
      await deleteMovie(other.id)

      expect(deleteJobs()).toEqual([
        ['delete-object', { key }, { startAfter: objectDeleteDelaySeconds('poster') }],
      ])
    })
  })

  describe('attachPoster', () => {
    const posterOf = async (id: string) =>
      (await db.movie.findUniqueOrThrow({ where: { id } })).posterUrl

    it('checks admin, then the key, then ownership, then the movie, then the object', async () => {
      const dune = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const otherAdmin = await createUser({ role: 'admin' })
      const theirKey = posterKey(otherAdmin.id)

      await expect(attachPoster({ id: dune.id, key: 'nope' })).rejects.toBeInstanceOf(
        UnauthorizedError,
      )
      await signInAs(await createUser({ role: 'editor' }))
      await expect(attachPoster({ id: dune.id, key: theirKey })).rejects.toBeInstanceOf(
        ForbiddenError,
      )

      const admin = await signInAsAdmin()
      await expect(attachPoster({ id: dune.id, key: 'nope' })).rejects.toBeInstanceOf(
        ValidationError,
      )
      // Another admin's object, and an object of another purpose under this admin's own id.
      await expect(attachPoster({ id: dune.id, key: theirKey })).rejects.toBeInstanceOf(
        ForbiddenError,
      )
      await expect(
        attachPoster({ id: dune.id, key: `avatars/${admin.id}/${crypto.randomUUID()}` }),
      ).rejects.toBeInstanceOf(ForbiddenError)
      // A missing movie is reported before the bucket is asked anything.
      await expect(
        attachPoster({ id: crypto.randomUUID(), key: posterKey(admin.id) }),
      ).rejects.toBeInstanceOf(NotFoundError)
      expect(headObject).not.toHaveBeenCalled()

      vi.mocked(headObject).mockResolvedValueOnce(null)
      await expect(attachPoster({ id: dune.id, key: posterKey(admin.id) })).rejects.toMatchObject({
        fieldErrors: { key: ['The file was not uploaded'] },
      })
      expect(await posterOf(dune.id)).toBeNull()
    })

    it('rejects an object that breaks the poster rule and deletes it at once', async () => {
      const dune = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const admin = await signInAsAdmin()
      const key = posterKey(admin.id)
      vi.mocked(headObject).mockResolvedValueOnce({ size: 4096, contentType: 'image/gif' })
      await expect(attachPoster({ id: dune.id, key })).rejects.toBeInstanceOf(ValidationError)
      expect(deleteObject).toHaveBeenCalledWith(key)
      expect(await posterOf(dune.id)).toBeNull()
    })

    it('sets the poster to the public URL and returns the detail', async () => {
      const dune = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      const admin = await signInAsAdmin()
      const key = posterKey(admin.id)

      const movie = await attachPoster({ id: dune.id, key })

      expect(movie.posterUrl).toBe(`${BUCKET_URL}${key}`)
      expect(await posterOf(dune.id)).toBe(movie.posterUrl)
      expect(headObject).toHaveBeenCalledWith(key)
      expect(deleteJobs()).toHaveLength(0)
      signOut()
      expect((await getMovieBySlug('dune-2021')).posterUrl).toBe(movie.posterUrl)
    })

    it('queues the replaced poster, unless it is the same object or not in the bucket', async () => {
      const dune = await seedMovie({
        title: 'Dune',
        releaseDate: '2021-10-22',
        posterUrl: 'https://image.tmdb.org/dune.jpg',
      })
      const admin = await signInAsAdmin()
      const first = posterKey(admin.id)
      const second = posterKey(admin.id)

      await attachPoster({ id: dune.id, key: first })
      expect(deleteJobs()).toHaveLength(0)
      await attachPoster({ id: dune.id, key: first })
      expect(deleteJobs()).toHaveLength(0)
      await attachPoster({ id: dune.id, key: second })
      expect(deleteJobs()).toEqual([
        ['delete-object', { key: first }, { startAfter: objectDeleteDelaySeconds('poster') }],
      ])
    })
  })

  describe('removePoster', () => {
    it('requires an admin, then a valid id, then an existing movie', async () => {
      const dune = await seedMovie({ title: 'Dune', releaseDate: '2021-10-22' })
      await expect(removePoster(dune.id)).rejects.toBeInstanceOf(UnauthorizedError)
      await signInAs(await createUser({ role: 'editor' }))
      await expect(removePoster(dune.id)).rejects.toBeInstanceOf(ForbiddenError)
      await signInAsAdmin()
      await expect(removePoster('a b')).rejects.toBeInstanceOf(ValidationError)
      await expect(removePoster(crypto.randomUUID())).rejects.toBeInstanceOf(NotFoundError)
    })

    it('clears the poster and queues its object, or nothing when there was none', async () => {
      const admin = await signInAsAdmin()
      const key = posterKey(admin.id)
      const dune = await seedMovie({
        title: 'Dune',
        releaseDate: '2021-10-22',
        posterUrl: `${BUCKET_URL}${key}`,
      })
      const bare = await seedMovie({ title: 'Arrival', releaseDate: '2016-11-11' })

      expect((await removePoster(dune.id)).posterUrl).toBeNull()
      expect((await removePoster(bare.id)).posterUrl).toBeNull()

      expect(deleteJobs()).toEqual([
        ['delete-object', { key }, { startAfter: objectDeleteDelaySeconds('poster') }],
      ])
    })
  })
})
