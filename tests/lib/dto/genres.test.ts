import { describe, expect, it } from 'vitest'
import {
  GENRE_NAME_MAX_LENGTH,
  genreInput,
  genreSchema,
  genreWithCountSchema,
  updateGenreInput,
} from '@/lib/dto/genres'

const ID = '0190d1a2-0000-7000-8000-000000000001'

describe('genreInput', () => {
  it('trims and bounds the name', () => {
    expect(genreInput.parse({ name: '  Science Fiction ' })).toEqual({ name: 'Science Fiction' })
    expect(genreInput.safeParse({ name: '   ' }).error?.issues[0]?.message).toBe('Name is required')
    expect(
      genreInput.safeParse({ name: 'a'.repeat(GENRE_NAME_MAX_LENGTH + 1) }).error?.issues[0]
        ?.message,
    ).toBe(`Name must be ${GENRE_NAME_MAX_LENGTH} characters or fewer`)
  })

  it('needs a genre id to update', () => {
    expect(updateGenreInput.parse({ id: ID, name: 'Drama' })).toEqual({ id: ID, name: 'Drama' })
    expect(updateGenreInput.safeParse({ id: '1', name: 'Drama' }).success).toBe(false)
  })
})

describe('genre outputs', () => {
  it('describe a genre and, in the list, how many movies carry it', () => {
    const genre = { id: ID, name: 'Drama', slug: 'drama' }
    expect(genreSchema.parse(genre)).toEqual(genre)
    expect(genreWithCountSchema.parse({ ...genre, movieCount: 3 }).movieCount).toBe(3)
    expect(genreWithCountSchema.safeParse(genre).success).toBe(false)
  })
})
