import { NextResponse } from 'next/server'
import { parseInput, toErrorResponse } from '@/lib/data/errors'
import { listPeople } from '@/lib/data/people'
import { listPeopleQuery } from '@/lib/dto/people'
import { toScalarParams } from '@/lib/searchParams'

/**
 * People by name, searched with `q`: the one list a client component fetches (the credits editor's
 * typeahead, through `lib/client/people.ts`). Public, like the DAL read it wraps; the query is
 * decoded here because every value arrives as a string, and the DAL validates it again.
 */
export const GET = async (request: Request) => {
  try {
    const query = parseInput(listPeopleQuery, toScalarParams(new URL(request.url).searchParams))
    return NextResponse.json(await listPeople(query))
  } catch (error) {
    return toErrorResponse(error)
  }
}
