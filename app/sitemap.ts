import type { MetadataRoute } from 'next'
import { connection } from 'next/server'
import {
  moviePath,
  moviesByGenrePath,
  personPath,
  ROUTE_HOME,
  ROUTE_MOVIES,
  ROUTE_PEOPLE,
} from '@/lib/constants-routes'
import { listGenres } from '@/lib/data/genres'
import { siteUrl } from '@/lib/data/site'
import { getSitemapCatalog } from '@/lib/data/sitemap'

/**
 * `/sitemap.xml`: the pages worth indexing, which are the ones with a canonical URL: home, the
 * movie and people lists, each genre that has films, and every movie and person page. Built per
 * request, so `next build` needs no database and the sitemap never lags the catalog (the DAL caches
 * it). One sitemap holds 50,000 URLs; past that, split it with `generateSitemaps`.
 */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  await connection()
  const origin = siteUrl()
  const url = (path: string) => new URL(path, origin).toString()
  const [catalog, genres] = await Promise.all([getSitemapCatalog(), listGenres()])

  return [
    { url: url(ROUTE_HOME) },
    { url: url(ROUTE_MOVIES) },
    { url: url(ROUTE_PEOPLE) },
    ...genres
      .filter((genre) => genre.movieCount > 0)
      .map((genre) => ({ url: url(moviesByGenrePath(genre.slug)) })),
    ...catalog.movies.map((movie) => ({
      url: url(moviePath(movie.slug)),
      lastModified: movie.updatedAt,
      ...(movie.imageUrl ? { images: [movie.imageUrl] } : {}),
    })),
    ...catalog.people.map((person) => ({
      url: url(personPath(person.slug)),
      lastModified: person.updatedAt,
      ...(person.imageUrl ? { images: [person.imageUrl] } : {}),
    })),
  ]
}

export default sitemap
