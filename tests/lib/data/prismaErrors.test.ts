// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/data/db'
import { isForeignKeyViolation, isUniqueViolation } from '@/lib/data/prismaErrors'
import { getRedis } from '@/lib/server/redis'
import { seedGenre, seedMovie } from '../../helpers/catalog'
import { resetDatabase } from '../../helpers/server'

const failureOf = (work: Promise<unknown>) =>
  work.then(
    () => null,
    (error: unknown) => error,
  )

describe('Prisma constraint violations', () => {
  beforeEach(resetDatabase)
  afterAll(async () => {
    await getRedis().quit()
    await db.$disconnect()
  })

  it('recognises a unique violation, by name when asked', async () => {
    await seedGenre('Drama')
    const error = await failureOf(db.genre.create({ data: { name: 'Drama', slug: 'drama-2' } }))
    expect(isUniqueViolation(error)).toBe(true)
    expect(isUniqueViolation(error, 'genres_name_key')).toBe(true)
    expect(isUniqueViolation(error, 'genres_slug_key')).toBe(false)
    expect(isForeignKeyViolation(error)).toBe(false)
  })

  it('recognises a foreign key violation, by name when asked', async () => {
    const genre = await seedGenre('Drama')
    await seedMovie({ title: 'Dune', releaseDate: '2021-10-22', genreIds: [genre.id] })
    const error = await failureOf(db.genre.delete({ where: { id: genre.id } }))
    expect(isForeignKeyViolation(error)).toBe(true)
    expect(isForeignKeyViolation(error, 'movie_genres_genre_id_fkey')).toBe(true)
    expect(isForeignKeyViolation(error, 'credits_person_id_fkey')).toBe(false)
    expect(isUniqueViolation(error)).toBe(false)
  })

  it('is false for anything else', () => {
    for (const value of [new Error('boom'), null, undefined, 'P2002']) {
      expect(isUniqueViolation(value)).toBe(false)
      expect(isForeignKeyViolation(value)).toBe(false)
    }
  })
})
