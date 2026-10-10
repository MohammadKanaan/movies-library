import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { hashPassword } from 'better-auth/crypto'
import Redis from 'ioredis'
import { PrismaClient } from '../generated/prisma/client.ts'
import { slugify } from '../lib/slug.ts'
import { isSeedStar, SEED_GENRES, SEED_MOVIES, seedPeople } from './catalog.ts'

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

/**
 * Comments on the reviews above, found by the movie and the review's author. They are written in
 * order, so the conversation reads as listed.
 */
const SEED_COMMENTS: { movieIndex: number; reviewer: string; author: string; body: string }[] = [
  {
    movieIndex: 0,
    reviewer: 'leanne@example.com',
    author: 'ervin@example.com',
    body: 'Agreed, the second watch is where it clicks.',
  },
  {
    movieIndex: 0,
    reviewer: 'leanne@example.com',
    author: 'leanne@example.com',
    body: 'Glad it is not only me.',
  },
  {
    movieIndex: 1,
    reviewer: 'ervin@example.com',
    author: 'leanne@example.com',
    body: 'That ending, though. I did not see it coming either.',
  },
]

/** One account per role (`users_role_valid`), plus a hundred distinct viewer accounts. */
const seedFirstNames = [
  'Maya',
  'Theo',
  'Nina',
  'Omar',
  'Lena',
  'Jules',
  'Amir',
  'Sofia',
  'Eli',
  'Zara',
]
const seedLastNames = [
  'Bennett',
  'Sato',
  'Khalil',
  'Morgan',
  'Costa',
  'Reed',
  'Haddad',
  'Park',
  'Silva',
  'Foster',
]
type SeedUser = {
  name: string
  username: string
  email: string
  role: 'viewer' | 'editor' | 'admin'
}
const SEED_USERS: SeedUser[] = [
  { name: 'Ada Admin', username: 'admin', email: 'admin@example.com', role: 'admin' },
  { name: 'Leanne Graham', username: 'leanne', email: 'leanne@example.com', role: 'editor' },
  { name: 'Ervin Howell', username: 'ervin', email: 'ervin@example.com', role: 'viewer' },
  ...Array.from({ length: 100 }, (_, index) => {
    const number = String(index + 1).padStart(3, '0')
    return {
      name: `${seedFirstNames[index % seedFirstNames.length]} ${seedLastNames[Math.floor(index / seedFirstNames.length)]}`,
      username: `movie-fan-${number}`,
      email: `movie-fan-${number}@example.com`,
      role: 'viewer' as const,
    }
  }),
]

const seedReviewBodies = [
  (title: string) =>
    `${title} has a confident sense of place, and its best scenes linger after the credits.`,
  (title: string) =>
    `I liked how ${title} lets its characters breathe instead of rushing to the next plot point.`,
  (title: string) =>
    `${title} builds beautifully. The final stretch brought all the earlier details together.`,
  (title: string) =>
    `A strong cast carries ${title}, especially in the quieter moments between the big scenes.`,
  (title: string) =>
    `${title} looks and sounds wonderful. I would happily watch it again on a big screen.`,
  (title: string) =>
    `The pacing in ${title} is uneven, but the central idea kept me interested throughout.`,
  (title: string) =>
    `${title} surprised me with how funny and warm it could be without losing its edge.`,
  (title: string) =>
    `Some parts of ${title} are rough, though the performances make it worth the time.`,
  (title: string) => `${title} takes a familiar setup somewhere more thoughtful than I expected.`,
  (title: string) =>
    `I enjoyed the atmosphere in ${title} most; every location feels carefully chosen.`,
  (title: string) => `${title} is at its best when it trusts the audience to connect the dots.`,
  (title: string) =>
    `A few scenes in ${title} hit harder than the story around them, and I keep thinking about those.`,
  (title: string) =>
    `${title} has a lovely score and a clear point of view. The middle could be tighter.`,
  (title: string) =>
    `I went in with low expectations and came away impressed by ${title}'s energy.`,
  (title: string) =>
    `${title} does not quite stick the landing, but getting there is a very good time.`,
  (title: string) =>
    `The smaller choices make ${title} work: the framing, the pauses, and the lived-in dialogue.`,
  (title: string) =>
    `${title} feels more interesting on reflection than it did while I was watching it.`,
  (title: string) =>
    `There is a lot to admire in ${title}, even if not every story thread gets enough room.`,
  (title: string) =>
    `${title} caught me off guard in the best way. I am glad I knew very little going in.`,
  (title: string) =>
    `A solid, entertaining film. ${title} knows exactly what kind of story it wants to tell.`,
]
const seedCommentBodies = [
  'That was my favorite part too.',
  'You put into words what I could not quite explain.',
  'I had a different reaction, but I see where you are coming from.',
  'The quieter scenes stayed with me as well.',
  'This makes me want to revisit it.',
  'I agree about the pacing, especially in the middle.',
  'Interesting take. The ending worked better for me on a second watch.',
  'The score deserves more credit than it gets.',
  'I am glad someone else noticed that detail.',
  'Good point about the cast carrying those scenes.',
  'I watched it last week and keep thinking about it too.',
  'That is exactly why I liked it.',
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
      return names.map((name, position) => ({
        personId: idOf(personIds, name),
        role,
        position,
        star: isSeedStar(role, position),
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
    where: { slug: { in: seededSlugs } },
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

  // Give each demo viewer ten reviews. The index pattern covers the full catalog once, while
  // stable text, ratings and assignments make each seed run predictable.
  const communityUsers = Array.from({ length: 100 }, (_, index) => {
    const number = String(index + 1).padStart(3, '0')
    return reviewAuthors.get(`movie-fan-${number}@example.com`)
  }).filter((id): id is string => Boolean(id))
  const communityReviews: {
    movieId: string
    authorId: string
    halfStars: number
    body: string
    spoiler: boolean
  }[] = []
  for (let userIndex = 0; userIndex < communityUsers.length; userIndex += 1) {
    for (let movieSlot = 0; movieSlot < 10; movieSlot += 1) {
      const reviewIndex = userIndex * 10 + movieSlot
      const movieIndex = Math.floor(
        (reviewIndex * SEED_MOVIES.length) / (communityUsers.length * 10),
      )
      const movieId = reviewMovieBySlug.get(seededSlugs[movieIndex])
      if (!movieId) {
        continue
      }
      communityReviews.push({
        movieId,
        authorId: communityUsers[userIndex],
        halfStars: ((reviewIndex * 7) % 10) + 1,
        body: seedReviewBodies[reviewIndex % seedReviewBodies.length](
          SEED_MOVIES[movieIndex].title,
        ),
        spoiler: reviewIndex % 37 === 0,
      })
    }
  }
  const insertedCommunityReviews = await db.review.createManyAndReturn({
    data: communityReviews,
    select: { id: true, movieId: true, authorId: true },
  })
  for (const { movieId } of insertedCommunityReviews) {
    reviewedNow.add(movieId)
  }

  // Comments hang off those reviews. Re-seeding replaces the users, and their comments go with
  // them, so these never double.
  for (const { movieIndex, reviewer, author, body } of SEED_COMMENTS) {
    const movieId = reviewMovieBySlug.get(seededSlugs[movieIndex])
    const reviewerId = reviewAuthors.get(reviewer)
    const authorId = reviewAuthors.get(author)
    if (!movieId || !reviewerId || !authorId) {
      continue
    }
    const review = await db.review.findUnique({
      where: { movieId_authorId: { movieId, authorId: reviewerId } },
      select: { id: true },
    })
    if (review) {
      await db.reviewComment.create({ data: { reviewId: review.id, authorId, body } })
    }
  }

  const communityComments = insertedCommunityReviews.flatMap((review, reviewIndex) =>
    Array.from({ length: 3 }, (_, commentIndex) => {
      const authorIndex = (reviewIndex + commentIndex * 31 + 1) % communityUsers.length
      return {
        reviewId: review.id,
        authorId: communityUsers[authorIndex],
        body: seedCommentBodies[(reviewIndex * 3 + commentIndex) % seedCommentBodies.length],
      }
    }),
  )
  await db.reviewComment.createMany({ data: communityComments })

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
      // `RATINGS_TAG` in lib/data/cacheTags.ts: the reviews below changed the movies' ratings.
      await redis.incr('cache:tag:ratings')
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
