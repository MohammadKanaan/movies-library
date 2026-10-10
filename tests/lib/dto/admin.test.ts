import { describe, expect, it } from 'vitest'
import { adminOverviewSchema, adminUserDetailSchema } from '@/lib/dto/admin'

const user = {
  id: 'u1',
  name: 'Ada',
  username: 'ada',
  email: 'ada@example.com',
  emailVerified: true,
  role: 'admin',
  banned: false,
  banReason: null,
  createdAt: '2026-10-05T15:04:00.000Z',
}

const movie = {
  id: 'm1',
  slug: 'dune-2021',
  title: 'Dune',
  releaseDate: '2021-10-22T00:00:00.000Z',
  runtimeMinutes: 155,
  posterUrl: null,
  genres: [],
  rating: { average: null, count: 0 },
}

const counts = {
  movies: 16,
  people: 60,
  genres: 12,
  users: 3,
  admins: 1,
  banned: 0,
  moviesWithoutPoster: 2,
}

describe('adminUserDetailSchema', () => {
  it('details a user with their image, sessions (never a token) and the movies they added', () => {
    const detail = adminUserDetailSchema.parse(
      JSON.parse(
        JSON.stringify({
          ...user,
          image: null,
          updatedAt: '2026-10-06T15:04:00.000Z',
          sessions: [
            {
              id: 's1',
              userAgent: 'Firefox',
              createdAt: '2026-10-06T15:04:00.000Z',
              expiresAt: '2026-10-13T15:04:00.000Z',
              token: 'secret',
            },
          ],
          movieCount: 1,
          movies: [movie],
        }),
      ),
    )
    expect(detail.updatedAt).toBeInstanceOf(Date)
    expect(detail.sessions[0]).toEqual({
      id: 's1',
      userAgent: 'Firefox',
      createdAt: new Date('2026-10-06T15:04:00.000Z'),
      expiresAt: new Date('2026-10-13T15:04:00.000Z'),
    })
    expect(detail.sessions[0]).not.toHaveProperty('token')
    expect(detail.movies[0]?.releaseDate).toBeInstanceOf(Date)
    expect(adminUserDetailSchema.safeParse({ ...user, image: null }).success).toBe(false)
  })
})

describe('adminOverviewSchema', () => {
  it('carries whole counts and revives the dates of the recent rows after a JSON round trip', () => {
    const overview = adminOverviewSchema.parse(
      JSON.parse(JSON.stringify({ counts, recentMovies: [movie], recentUsers: [user] })),
    )
    expect(overview.counts).toEqual(counts)
    expect(overview.recentMovies[0]?.releaseDate).toBeInstanceOf(Date)
    expect(overview.recentUsers[0]?.createdAt).toBeInstanceOf(Date)
  })

  it('refuses a fractional or missing count', () => {
    const base = { recentMovies: [], recentUsers: [] }
    expect(
      adminOverviewSchema.safeParse({ ...base, counts: { ...counts, movies: 1.5 } }).success,
    ).toBe(false)
    const { banned, ...incomplete } = counts
    void banned
    expect(adminOverviewSchema.safeParse({ ...base, counts: incomplete }).success).toBe(false)
  })
})
