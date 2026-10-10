import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { hashPassword } from 'better-auth/crypto'
import Redis from 'ioredis'
import { PrismaClient } from '../generated/prisma/client.ts'
import { slugify } from '../lib/slug.ts'
import { SEED_GENRES, SEED_MOVIES, seedPeople } from './catalog.ts'

/** Dev-only password shared by every seeded account. */
const SEED_PASSWORD = 'password123'

/**
 * A few reviews by the editor and the viewer, on the first movies of the catalog (their slugs are
 * looked up, so a catalog without them seeds fewer). One carries a spoiler, one is a rating alone.
 */
const SEED_REVIEWS: {
  movieIndex: number
  author: string
  halfStars: number
  body: string | null
  spoiler?: boolean
}[] = [
  {
    movieIndex: 0,
    author: 'leanne@example.com',
    halfStars: 9,
    body: 'A patient, beautiful film that rewards a second watch.',
  },
  {
    movieIndex: 0,
    author: 'ervin@example.com',
    halfStars: 7,
    body: 'Slow in the middle, but the last act is worth the wait.\n\nThe score does a lot of the work.',
  },
  {
    movieIndex: 1,
    author: 'ervin@example.com',
    halfStars: 10,
    body: 'The twist at the end recontextualises everything before it. I watched it again the next day.',
    spoiler: true,
  },
  { movieIndex: 1, author: 'leanne@example.com', halfStars: 5, body: null },
  { movieIndex: 2, author: 'ervin@example.com', halfStars: 1, body: null },
  {
    movieIndex: 2,
    author: 'leanne@example.com',
    halfStars: 8,
    body: 'Funny, sharp and much shorter than it feels.',
  },
]

/** One account per role (`users_role_valid`). */
const SEED_USERS: {
  name: string
  username: string
  email: string
  role: 'viewer' | 'editor' | 'admin'
}[] = [
  { name: 'Ada Admin', username: 'admin', email: 'admin@example.com', role: 'admin' },
  { name: 'Leanne Graham', username: 'leanne', email: 'leanne@example.com', role: 'editor' },
  { name: 'Ervin Howell', username: 'ervin', email: 'ervin@example.com', role: 'viewer' },
]

// The seeded accounts have a public password and one of them is an admin, so a production
// container must not be seeded by accident.
if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== '1') {
  console.error(
    'Refusing to seed in production (the seed creates admin@example.com / password123). Set ALLOW_SEED=1 to override.',
  )
  process.exit(1)
}

// The script owns its client (and disconnects it); `lib/data/db.ts` is server-only.
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, options: '-c timezone=UTC' }),
})

try {
  const password = await hashPassword(SEED_PASSWORD)

  // Replacing the users below deletes their reviews, so these movies' cached ratings go stale.
  const reviewedBefore = await db.review.findMany({
    distinct: ['movieId'],
    select: { movieId: true },
  })

  for (const data of SEED_USERS) {
    // Re-seeding replaces the user; sessions and accounts cascade, their movies keep a null owner.
    await db.user.deleteMany({ where: { email: data.email } })

    // Ids come from the schema's `@default(uuid(7))`. Better Auth's credential account uses the
    // user's id as its `accountId`, so the account is created once the id is known.
    const user = await db.user.create({
      data: { ...data, emailVerified: true },
      select: { id: true },
    })
    await db.account.create({
      data: { accountId: user.id, providerId: 'credential', password, userId: user.id },
    })
  }

  console.log(
    `Seeded ${SEED_USERS.length} users (${SEED_USERS.map((user) => user.role).join(', ')}; ` +
      `password "${SEED_PASSWORD}").`,
  )

  // The catalog upserts by slug (derived like the DAL derives it), so re-seeding keeps ids and
  // replaces each movie's genre links and credits. The seeded admin is every movie's creator.
  const admin = await db.user.findUniqueOrThrow({
    where: { email: 'admin@example.com' },
    select: { id: true },
  })

  const genreIds = new Map<string, string>()
  for (const name of SEED_GENRES) {
    const slug = slugify(name)
    const genre = await db.genre.upsert({
      where: { slug },
      create: { name, slug },
      update: { name },
      select: { id: true },
    })
    genreIds.set(name, genre.id)
  }

  const personIds = new Map<string, string>()
  for (const { name, bio, birthDate } of seedPeople()) {
    const slug = slugify(name)
    // The headshot is left alone, so one uploaded in development survives a re-seed.
    const data = {
      name,
      bio,
      birthDate: birthDate ? new Date(`${birthDate}T00:00:00.000Z`) : null,
    }
    const person = await db.person.upsert({
      where: { slug },
      create: { ...data, slug },
      update: data,
      select: { id: true },
    })
    personIds.set(name, person.id)
  }

  const idOf = (map: Map<string, string>, name: string) => {
    const id = map.get(name)
    if (!id) {
      throw new Error(`Seed data references an unknown name: ${name}`)
    }
    return id
  }

  const seededSlugs: string[] = []
  for (const seed of SEED_MOVIES) {
    const slug = `${slugify(seed.title)}-${seed.releaseDate.slice(0, 4)}`
    seededSlugs.push(slug)
    // `createdById` is set on update too: re-seeding recreates the admin, which nulled it.
    const data = {
      title: seed.title,
      synopsis: seed.synopsis,
      releaseDate: new Date(`${seed.releaseDate}T00:00:00.000Z`),
      runtimeMinutes: seed.runtimeMinutes,
      posterUrl: seed.posterUrl,
      createdById: admin.id,
    }
    const credits = (['DIRECTOR', 'WRITER', 'ACTOR'] as const).flatMap((role) => {
      const names =
        role === 'DIRECTOR' ? seed.directors : role === 'WRITER' ? seed.writers : seed.cast
      // The first three billed actors are the stars, as the `credit_star` migration backfilled.
      return names.map((name, position) => ({
        personId: idOf(personIds, name),
        role,
        position,
        star: role === 'ACTOR' && position < 3,
      }))
    })
    await db.$transaction(async (tx) => {
      const movie = await tx.movie.upsert({
        where: { slug },
        create: { ...data, slug },
        update: data,
        select: { id: true },
      })
      await tx.movieGenre.deleteMany({ where: { movieId: movie.id } })
      await tx.movieGenre.createMany({
        data: seed.genres.map((name) => ({ movieId: movie.id, genreId: idOf(genreIds, name) })),
      })
      await tx.credit.deleteMany({ where: { movieId: movie.id } })
      await tx.credit.createMany({
        data: credits.map((credit) => ({ movieId: movie.id, ...credit })),
      })
    })
  }

  // Reviews are upserted on their unique (movie, author) pair, like the movies on their slug.
  const reviewMovies = await db.movie.findMany({
    where: { slug: { in: seededSlugs.slice(0, 3) } },
    select: { id: true, slug: true },
  })
  const reviewMovieBySlug = new Map(reviewMovies.map((movie) => [movie.slug, movie.id]))
  const reviewAuthors = new Map(
    (await db.user.findMany({ select: { id: true, email: true } })).map((user) => [
      user.email,
      user.id,
    ]),
  )
  const reviewedNow = new Set<string>()
  for (const { movieIndex, author, halfStars, body, spoiler = false } of SEED_REVIEWS) {
    const movieId = reviewMovieBySlug.get(seededSlugs[movieIndex])
    const authorId = reviewAuthors.get(author)
    if (!movieId || !authorId) {
      continue
    }
    const data = { halfStars, body, spoiler }
    await db.review.upsert({
      where: { movieId_authorId: { movieId, authorId } },
      create: { ...data, movieId, authorId },
      update: data,
    })
    reviewedNow.add(movieId)
  }

  // The dev seed replaces the movie catalog. Prune only after every upsert succeeds, so a
  // partially failed seed never deletes movies it has not finished loading.
  const removed = await db.movie.deleteMany({ where: { slug: { notIn: seededSlugs } } })

  // Like the Prisma client above, this CLI owns its Redis connection. Bump the same catalog
  // tag used by lib/server/cache.ts so lists, details, genres and filmographies reload at once.
  if (process.env.REDIS_URL) {
    const redis = new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      connectTimeout: 1000,
      commandTimeout: 1000,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
    })
    // Command failures are handled below; prevent connection errors becoming unhandled events.
    redis.on('error', () => {})
    try {
      await redis.incr('cache:tag:catalog')
      // `reviewsTag` in lib/data/cacheTags.ts: the rating summaries of every movie whose reviews changed.
      const reviewed = new Set([...reviewedBefore.map((row) => row.movieId), ...reviewedNow])
      for (const movieId of reviewed) {
        await redis.incr(`cache:tag:reviews:${movieId}`)
      }
    } catch (error) {
      console.warn('Catalog seeded, but cache invalidation failed:', error)
    } finally {
      redis.disconnect()
    }
  } else {
    console.warn('REDIS_URL is unset; catalog caches were not invalidated.')
  }

  console.log(
    `Seeded ${SEED_GENRES.length} genres, ${personIds.size} people and ${SEED_MOVIES.length} movies; removed ${removed.count} movies outside the seed catalog; ${reviewedNow.size} movies reviewed.`,
  )
} finally {
  await db.$disconnect()
}
