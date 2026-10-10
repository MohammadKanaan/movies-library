import 'server-only'
import { z } from 'zod'
import { searchCatalogQuery, type SearchCatalogQuery, type SearchResults } from '@/lib/dto/search'
import { db } from './db'
import { parseInput } from './errors'
import { escapeLike } from './escapeLike'
import { movieSummarySelect, toMovieSummary } from './movies'
import { personListItemSelect, toPersonListItem } from './people'

// The catalog's quick search ("search all"): one term, the best movies and people for it. Public,
// never cached (a term is an unbounded key), and ranked in SQL because Prisma cannot order by an
// expression: an exact title or name first, then one that starts with the term, then by trigram
// similarity (`pg_trgm`, already installed for the search indexes), newest movies and A–Z people
// among equals, `id` as the final tiebreaker. The match itself is the lists' `ILIKE '%term%'`, so a
// search finds exactly what the filtered lists would, just in a better order.

/** The ranked ids a search query returns; the rows are then read with the lists' selects. */
const idRowsSchema = z.array(z.object({ id: z.uuid() }))

/** Keeps `items` in the order of `ids` (`WHERE id IN (...)` returns rows in no particular order). */
const inOrder = <T extends { id: string }>(ids: string[], items: T[]): T[] => {
  const byId = new Map(items.map((item) => [item.id, item]))
  return ids.flatMap((id) => {
    const item = byId.get(id)
    return item ? [item] : []
  })
}

const rankedMovieIds = async (term: string, contains: string, prefix: string, limit: number) => {
  const rows = await db.$queryRaw`
    SELECT id FROM movies
    WHERE title ILIKE ${contains}
    ORDER BY lower(title) = lower(${term}) DESC,
      title ILIKE ${prefix} DESC,
      similarity(title, ${term}) DESC,
      release_date DESC,
      id DESC
    LIMIT ${limit}`
  return idRowsSchema.parse(rows).map((row) => row.id)
}

const rankedPersonIds = async (term: string, contains: string, prefix: string, limit: number) => {
  const rows = await db.$queryRaw`
    SELECT id FROM people
    WHERE name ILIKE ${contains}
    ORDER BY lower(name) = lower(${term}) DESC,
      name ILIKE ${prefix} DESC,
      similarity(name, ${term}) DESC,
      name ASC,
      id ASC
    LIMIT ${limit}`
  return idRowsSchema.parse(rows).map((row) => row.id)
}

/**
 * Public: the best `limit` movies (by title) and people (by name) for `q`, case-insensitive with
 * wildcards literal, plus how many of each match in all. See the ranking above.
 */
export const searchCatalog = async (query: SearchCatalogQuery): Promise<SearchResults> => {
  const { q, limit } = parseInput(searchCatalogQuery, query)
  const escaped = escapeLike(q)
  const contains = `%${escaped}%`
  const prefix = `${escaped}%`
  const [movieIds, personIds, movieTotal, peopleTotal] = await Promise.all([
    rankedMovieIds(q, contains, prefix, limit),
    rankedPersonIds(q, contains, prefix, limit),
    db.movie.count({ where: { title: { contains: escaped, mode: 'insensitive' } } }),
    db.person.count({ where: { name: { contains: escaped, mode: 'insensitive' } } }),
  ])
  const [movies, people] = await Promise.all([
    db.movie.findMany({ where: { id: { in: movieIds } }, select: movieSummarySelect }),
    db.person.findMany({ where: { id: { in: personIds } }, select: personListItemSelect }),
  ])
  return {
    q,
    movies: { items: inOrder(movieIds, movies.map(toMovieSummary)), totalItems: movieTotal },
    people: { items: inOrder(personIds, people.map(toPersonListItem)), totalItems: peopleTotal },
  }
}
