import { NextResponse } from 'next/server'
import { parseInput, toErrorResponse } from '@/lib/data/errors'
import { suggestCatalog } from '@/lib/data/search'
import { searchCatalogQuery } from '@/lib/dto/search'
import { toScalarParams } from '@/lib/searchParams'

/**
 * The best movie and people matches for `q`, without totals, for the NavBar's suggestions (through
 * `lib/client/search.ts`). Public, like the DAL read it wraps; the query is decoded here because
 * every value arrives as a string, and the DAL validates it again.
 */
export const GET = async (request: Request) => {
  try {
    const query = parseInput(searchCatalogQuery, toScalarParams(new URL(request.url).searchParams))
    return NextResponse.json(await suggestCatalog(query))
  } catch (error) {
    return toErrorResponse(error)
  }
}
