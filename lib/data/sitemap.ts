import 'server-only'
import type { Prisma } from '@/generated/prisma/client'
import { MINUTE } from '@/lib/constants-time'
import { sitemapCatalogSchema, type SitemapCatalog } from '@/lib/dto/sitemap'
import { remember } from '@/lib/server/cache'
import { CATALOG_TAG } from './cacheTags'
import { db } from './db'

const SITEMAP_CACHE_TTL = 30 * MINUTE

const movieEntrySelect = {
  slug: true,
  updatedAt: true,
  posterUrl: true,
} satisfies Prisma.MovieSelect

const personEntrySelect = {
  slug: true,
  updatedAt: true,
  headshotUrl: true,
} satisfies Prisma.PersonSelect

/**
 * Public: every movie and person page with when its record last changed and its image, by slug.
 * The catalog is public and the same for every viewer, so the list is cached until a catalog write.
 */
export const getSitemapCatalog = async (): Promise<SitemapCatalog> => {
  return remember(
    'sitemap:catalog',
    { ttl: SITEMAP_CACHE_TTL, tags: [CATALOG_TAG], schema: sitemapCatalogSchema },
    async () => {
      const [movies, people] = await Promise.all([
        db.movie.findMany({ select: movieEntrySelect, orderBy: { slug: 'asc' } }),
        db.person.findMany({ select: personEntrySelect, orderBy: { slug: 'asc' } }),
      ])
      return {
        movies: movies.map(({ posterUrl, ...movie }) => ({ ...movie, imageUrl: posterUrl })),
        people: people.map(({ headshotUrl, ...person }) => ({ ...person, imageUrl: headshotUrl })),
      }
    },
  )
}
