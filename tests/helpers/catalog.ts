import { db } from '@/lib/data/db'
import type { CreditRole } from '@/lib/dto/catalog'
import { slugify } from '@/lib/slug'

/** Rows written straight to the database, bypassing the DAL, for tests to read back through it. */

export const seedGenre = (name: string) => {
  return db.genre.create({ data: { name, slug: slugify(name) } })
}

export const seedPerson = (name: string, slug = slugify(name)) => {
  return db.person.create({ data: { name, slug } })
}

export type SeedMovie = {
  title: string
  /** `YYYY-MM-DD` */
  releaseDate: string
  slug?: string
  synopsis?: string | null
  runtimeMinutes?: number | null
  posterUrl?: string | null
  createdById?: string | null
  genreIds?: string[]
  credits?: { personId: string; role: CreditRole; position?: number; star?: boolean }[]
}

export const seedMovie = ({
  title,
  releaseDate,
  slug,
  genreIds = [],
  credits = [],
  ...rest
}: SeedMovie) => {
  return db.movie.create({
    data: {
      ...rest,
      title,
      slug: slug ?? `${slugify(title)}-${releaseDate.slice(0, 4)}`,
      releaseDate: new Date(`${releaseDate}T00:00:00.000Z`),
      genres: { create: genreIds.map((genreId) => ({ genreId })) },
      credits: {
        create: credits.map((credit, index) => ({
          personId: credit.personId,
          role: credit.role,
          position: credit.position ?? index,
          star: credit.star,
        })),
      },
    },
  })
}

export type SeedReview = {
  movieId: string
  authorId: string
  /** In stars, ½ to 5. */
  rating: number
  body?: string | null
  spoiler?: boolean
  createdAt?: Date
}

export const seedReview = ({ rating, body = null, spoiler = false, ...rest }: SeedReview) => {
  return db.review.create({ data: { ...rest, halfStars: rating * 2, body, spoiler } })
}
