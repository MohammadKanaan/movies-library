import 'server-only'
import { z } from 'zod'
import {
  searchCatalogQuery,
  type SearchCatalogQuery,
  type SearchResults,
  type SearchSuggestions,
} from '@/lib/dto/search'
import { db } from './db'
import { parseInput } from './errors'
import { escapeLike } from './escapeLike'
import { movieSummarySelect, toMovieSummary } from './movieSummary'
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

const rankedMovies = async (term: string, contains: string, prefix: string, limit: number) => {
  const ids = await rankedMovieIds(term, contains, prefix, limit)
  const rows = await db.movie.findMany({ where: { id: { in: ids } }, select: movieSummarySelect })
  return inOrder(ids, rows.map(toMovieSummary))
}

const rankedPeople = async (term: string, contains: string, prefix: string, limit: number) => {
  const ids = await rankedPersonIds(term, contains, prefix, limit)
  const rows = await db.person.findMany({
    where: { id: { in: ids } },
    select: {
      ...personListItemSelect,
      // The list's plain `_count` groups the whole credits table before joining the few people
      // asked for; bounding the count to those people keeps the aggregate to their credits.
      _count: { select: { credits: { where: { personId: { in: ids } } } } },
    },
  })
  return inOrder(ids, rows.map(toPersonListItem))
}

/** The parsed query's LIKE patterns: the term with wildcards literal, anywhere and as a prefix. */
const patterns = (q: string) => {
  const escaped = escapeLike(q)
  return { escaped, contains: `%${escaped}%`, prefix: `${escaped}%` }
}

/**
 * Public: the best `limit` movies (by title) and people (by name) for `q`, case-insensitive with
 * wildcards literal, plus how many of each match in all. See the ranking above. For the search page;
 * the NavBar's suggestions use `suggestCatalog`, which skips the totals.
 */
export const searchCatalog = async (query: SearchCatalogQuery): Promise<SearchResults> => {
  const { q, limit } = parseInput(searchCatalogQuery, query)
  const { escaped, contains, prefix } = patterns(q)
  const [movies, people, movieTotal, peopleTotal] = await Promise.all([
    rankedMovies(q, contains, prefix, limit),
    rankedPeople(q, contains, prefix, limit),
    db.movie.count({ where: { title: { contains: escaped, mode: 'insensitive' } } }),
    db.person.count({ where: { name: { contains: escaped, mode: 'insensitive' } } }),
  ])
  return {
    q,
    movies: { items: movies, totalItems: movieTotal },
    people: { items: people, totalItems: peopleTotal },
  }
}

/**
 * Public: `searchCatalog` without the totals, for suggestions as the visitor types. The typeahead
 * only needs to know whether anything matched, which the items say, so the two count scans are
 * spared on a path that runs on every pause in typing.
 */
export const suggestCatalog = async (query: SearchCatalogQuery): Promise<SearchSuggestions> => {
  const { q, limit } = parseInput(searchCatalogQuery, query)
  const { contains, prefix } = patterns(q)
  const [movies, people] = await Promise.all([
    rankedMovies(q, contains, prefix, limit),
    rankedPeople(q, contains, prefix, limit),
  ])
  return { q, movies, people }
}
