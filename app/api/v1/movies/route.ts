import { NextResponse } from 'next/server'
import { parseInput, toErrorResponse } from '@/lib/data/errors'
import { listMovies } from '@/lib/data/movies'
import { listMoviesUrlQuery } from '@/lib/dto/movies'
import { toScalarParams } from '@/lib/searchParams'

/**
 * Public catalog pages for the movie list's infinite scroll (through `lib/client/movies.ts`), the
 * same read the page's first batch makes. Public like the DAL read it wraps; the query is decoded
 * with the URL form of the DTO because every value arrives as a string, and the DAL validates again.
 */
export const GET = async (request: Request) => {
  try {
    const query = parseInput(listMoviesUrlQuery, toScalarParams(new URL(request.url).searchParams))
    return NextResponse.json(await listMovies(query))
  } catch (error) {
    return toErrorResponse(error)
  }
}
