// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/lib/data/db'
import { getFanFavorites, getTrendingMovies, getTrendingPeople } from '@/lib/data/discover'
import { getRedis } from '@/lib/server/redis'
import { seedComment, seedMovie, seedPerson, seedReview } from '../../helpers/catalog'
import { resetDatabase, resetRedis } from '../../helpers/server'

const { cookieStore, requestHeaders } = await vi.hoisted(
  async () => import('../../helpers/cookies'),
)
vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
  headers: async () => requestHeaders(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), refresh: vi.fn() }))

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS

const ago = (ms: number) => new Date(Date.now() - ms)

/** Review authors only: rows written directly, no account, since nobody signs in. */
const seedAuthors = async (count: number) => {
  const suffix = Math.random().toString(36).slice(2, 8)
  return Promise.all(
    Array.from({ length: count }, (_, index) =>
      db.user.create({
        data: {
          name: `Author ${index}`,
          username: `author_${suffix}_${index}`,
          email: `author-${suffix}-${index}@example.com`,
        },
      }),
    ),
  )
}

/** One review per rating, each by a different author. */
const seedRatings = async (movieId: string, ratings: number[]) => {
  const authors = await seedAuthors(ratings.length)
  await Promise.all(
    ratings.map((rating, index) => seedReview({ movieId, authorId: authors[index].id, rating })),
  )
}

const titles = (movies: { title: string }[]) => movies.map((movie) => movie.title)
const names = (people: { name: string }[]) => people.map((person) => person.name)

beforeEach(resetDatabase)
afterAll(async () => {
  await getRedis().quit()
  await db.$disconnect()
})

describe('getTrendingMovies', () => {
  it('is public and returns summaries of movies with activity, the most recent first', async () => {
    const [author] = await seedAuthors(1)
    const lastMonth = await seedMovie({ title: 'Last Month', releaseDate: '2020-01-01' })
    const thisWeek = await seedMovie({ title: 'This Week', releaseDate: '2021-01-01' })
    const today = await seedMovie({ title: 'Today', releaseDate: '2022-01-01' })
    await seedMovie({ title: 'Never Reviewed', releaseDate: '2023-01-01' })
    await seedReview({
      movieId: lastMonth.id,
      authorId: author.id,
      rating: 4,
      createdAt: ago(30 * DAY_MS),
    })
    await seedReview({
      movieId: thisWeek.id,
      authorId: author.id,
      rating: 4,
      createdAt: ago(5 * DAY_MS),
    })
    await seedReview({ movieId: today.id, authorId: author.id, rating: 4, createdAt: ago(HOUR_MS) })

    const movies = await getTrendingMovies()
    // A month-old review is outside the window: it only fills the shelf after the recent ones.
    expect(titles(movies)).toEqual(['Today', 'This Week', 'Last Month'])
    expect(movies[0]).toEqual({
      id: today.id,
      slug: 'today-2022',
      title: 'Today',
      releaseDate: new Date('2022-01-01T00:00:00.000Z'),
      runtimeMinutes: null,
      posterUrl: null,
      genres: [],
      rating: { average: 4, count: 1 },
    })
  })

  it('counts comments toward the movie their review is about, and old activity in bulk', async () => {
    const [first, second] = await seedAuthors(2)
    const quiet = await seedMovie({ title: 'Quiet', releaseDate: '2020-01-01' })
    const discussed = await seedMovie({ title: 'Discussed', releaseDate: '2021-01-01' })
    const classic = await seedMovie({ title: 'Classic', releaseDate: '1990-01-01' })
    await seedReview({ movieId: quiet.id, authorId: first.id, rating: 3, createdAt: ago(HOUR_MS) })
    const review = await seedReview({
      movieId: discussed.id,
      authorId: first.id,
      rating: 3,
      createdAt: ago(HOUR_MS),
    })
    await seedComment({ reviewId: review.id, authorId: second.id, createdAt: ago(HOUR_MS) })
    // Busier than either of all time, but none of it this week.
    for (const author of [first, second]) {
      await seedReview({
        movieId: classic.id,
        authorId: author.id,
        rating: 5,
        createdAt: ago(60 * DAY_MS),
      })
    }

    expect(titles(await getTrendingMovies())).toEqual(['Discussed', 'Quiet', 'Classic'])
  })

  it('caches the ranking for its TTL but reads the cards fresh', async () => {
    const [author] = await seedAuthors(1)
    const first = await seedMovie({ title: 'First', releaseDate: '2020-01-01' })
    const second = await seedMovie({ title: 'Second', releaseDate: '2021-01-01' })
    const third = await seedMovie({ title: 'Third', releaseDate: '2022-01-01' })
    await seedReview({ movieId: first.id, authorId: author.id, rating: 3 })
    await seedReview({ movieId: third.id, authorId: author.id, rating: 3 })
    expect(titles(await getTrendingMovies())).toHaveLength(2)

    // A new review waits for the TTL; a rename, a new rating and a deletion show at once.
    await seedReview({ movieId: second.id, authorId: author.id, rating: 3 })
    await db.movie.update({ where: { id: first.id }, data: { title: 'First, Renamed' } })
    await db.movie.delete({ where: { id: third.id } })
    const movies = await getTrendingMovies()
    expect(titles(movies)).toEqual(['First, Renamed'])

    await resetRedis()
    expect(titles(await getTrendingMovies()).sort()).toEqual(['First, Renamed', 'Second'])
  })
})

describe('getTrendingPeople', () => {
  it('ranks the people on trending movies, those who headline them first', async () => {
    const [author] = await seedAuthors(1)
    const director = await seedPerson('The Director')
    const star = await seedPerson('Billed Last Star')
    const lead = await seedPerson('First Billed')
    const extra = await seedPerson('Tenth Billed')
    const writer = await seedPerson('The Writer')
    const elsewhere = await seedPerson('In A Quiet Movie')
    const trending = await seedMovie({
      title: 'Trending',
      releaseDate: '2024-01-01',
      credits: [
        { personId: director.id, role: 'DIRECTOR', position: 0 },
        { personId: writer.id, role: 'WRITER', position: 0 },
        { personId: lead.id, role: 'ACTOR', position: 0 },
        { personId: extra.id, role: 'ACTOR', position: 9 },
        { personId: star.id, role: 'ACTOR', position: 10, star: true },
      ],
    })
    await seedMovie({
      title: 'Quiet',
      releaseDate: '2024-01-01',
      credits: [{ personId: elsewhere.id, role: 'DIRECTOR' }],
    })
    await seedReview({ movieId: trending.id, authorId: author.id, rating: 4 })

    const people = await getTrendingPeople()
    expect(people).toHaveLength(5)
    expect(names(people.slice(0, 3)).sort()).toEqual(
      ['Billed Last Star', 'First Billed', 'The Director'].sort(),
    )
    expect(names(people.slice(3)).sort()).toEqual(['Tenth Billed', 'The Writer'].sort())
    expect(people.find((person) => person.id === director.id)).toEqual({
      id: director.id,
      slug: 'the-director',
      name: 'The Director',
      headshotUrl: null,
      creditCount: 1,
      createdAt: expect.any(Date),
    })
  })

  it('adds up a person’s movies, counting a writer-director once per movie', async () => {
    const [author] = await seedAuthors(1)
    const auteur = await seedPerson('Writer Director')
    const busy = await seedPerson('Two Films')
    const first = await seedMovie({
      title: 'First',
      releaseDate: '2024-01-01',
      credits: [
        { personId: auteur.id, role: 'DIRECTOR' },
        { personId: auteur.id, role: 'WRITER' },
        { personId: busy.id, role: 'ACTOR' },
      ],
    })
    const second = await seedMovie({
      title: 'Second',
      releaseDate: '2024-01-01',
      credits: [{ personId: busy.id, role: 'ACTOR' }],
    })
    await seedReview({ movieId: first.id, authorId: author.id, rating: 4 })
    await seedReview({ movieId: second.id, authorId: author.id, rating: 4 })

    expect(names(await getTrendingPeople())).toEqual(['Two Films', 'Writer Director'])
  })
})

describe('getFanFavorites', () => {
  it('ranks by the weighted mean and leaves out thinly rated movies', async () => {
    const perfect = await seedMovie({ title: 'Three Perfect', releaseDate: '2020-01-01' })
    const loved = await seedMovie({ title: 'Widely Loved', releaseDate: '2021-01-01' })
    const panned = await seedMovie({ title: 'Panned', releaseDate: '2022-01-01' })
    const thin = await seedMovie({ title: 'Two Ratings', releaseDate: '2023-01-01' })
    await seedMovie({ title: 'Unrated', releaseDate: '2024-01-01' })
    await seedRatings(perfect.id, [5, 5, 5])
    await seedRatings(loved.id, [...Array(11).fill(5), 4])
    await seedRatings(panned.id, [1, 1, 1])
    await seedRatings(thin.id, [5, 5])

    const favorites = await getFanFavorites()
    // Three 5★ ratings have the best plain mean, but twelve near-perfect ones weigh more.
    expect(titles(favorites)).toEqual(['Widely Loved', 'Three Perfect', 'Panned'])
    expect(favorites.map((movie) => movie.rating)).toEqual([
      { average: 4.9, count: 12 },
      { average: 5, count: 3 },
      { average: 1, count: 3 },
    ])
    expect(favorites[0]).toMatchObject({ id: loved.id, slug: 'widely-loved-2021', genres: [] })
  })

  it('is empty until a movie has enough ratings', async () => {
    const movie = await seedMovie({ title: 'Two Ratings', releaseDate: '2023-01-01' })
    await seedRatings(movie.id, [5, 4])
    expect(await getFanFavorites()).toEqual([])
  })
})
