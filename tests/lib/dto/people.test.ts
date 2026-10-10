import { describe, expect, it } from 'vitest'
import { MAX_PAGE } from '@/lib/dto/common'
import {
  listPeopleQuery,
  PEOPLE_SEARCH_MAX_LENGTH,
  peopleUrlQuery,
  PERSON_NAME_MAX_LENGTH,
  personDetailSchema,
  personInput,
  personSummarySchema,
  updatePersonInput,
} from '@/lib/dto/people'

const ID = '0190d1a2-0000-7000-8000-000000000001'
const MOVIE_ID = '0190d1a2-0000-7000-8000-000000000002'

describe('personInput', () => {
  it('trims and bounds the name', () => {
    expect(personInput.parse({ name: '  Denis Villeneuve ' })).toEqual({ name: 'Denis Villeneuve' })
    expect(personInput.safeParse({ name: '' }).error?.issues[0]?.message).toBe('Name is required')
    expect(personInput.safeParse({ name: 'a'.repeat(PERSON_NAME_MAX_LENGTH + 1) }).success).toBe(
      false,
    )
  })

  it('needs a person id to update', () => {
    expect(updatePersonInput.parse({ id: ID, name: 'Greta Gerwig' })).toEqual({
      id: ID,
      name: 'Greta Gerwig',
    })
    expect(updatePersonInput.safeParse({ id: 'nope', name: 'Greta Gerwig' }).success).toBe(false)
  })
})

describe('people list', () => {
  it('bounds and trims the search, and defaults the paging', () => {
    expect(listPeopleQuery.parse({})).toEqual({ page: 1, perPage: 10 })
    expect(listPeopleQuery.parse({ q: '  denis ' }).q).toBe('denis')
    expect(listPeopleQuery.safeParse({ q: 'a'.repeat(PEOPLE_SEARCH_MAX_LENGTH + 1) }).success).toBe(
      false,
    )
    // The trigram index cannot serve fewer than three characters.
    expect(listPeopleQuery.safeParse({ q: 'de' }).success).toBe(false)
    expect(listPeopleQuery.parse({ q: '  ' }).q).toBe('')
    expect(listPeopleQuery.safeParse({ page: String(MAX_PAGE + 1) }).success).toBe(false)
  })

  it('parses any URL by falling back per field', () => {
    expect(peopleUrlQuery.parse({})).toEqual({ page: 1, q: '' })
    expect(peopleUrlQuery.parse({ page: 'abc', q: 'a'.repeat(101) })).toEqual({ page: 1, q: '' })
    expect(peopleUrlQuery.parse({ q: 'de' })).toEqual({ page: 1, q: '' })
    expect(peopleUrlQuery.parse({ page: '3', q: ' denis ' })).toEqual({ page: 3, q: 'denis' })
  })
})

describe('person outputs', () => {
  const summary = { id: ID, slug: 'denis-villeneuve', name: 'Denis Villeneuve' }

  it('summarise a person as id, slug and name', () => {
    expect(personSummarySchema.parse(summary)).toEqual(summary)
  })

  it('revive dates in the detail and its filmography after a JSON round trip', () => {
    const detail = personDetailSchema.parse(
      JSON.parse(
        JSON.stringify({
          ...summary,
          createdAt: new Date('2026-01-01T00:00:00Z'),
          updatedAt: new Date('2026-01-02T00:00:00Z'),
          filmography: {
            directed: [
              {
                id: MOVIE_ID,
                slug: 'dune-2021',
                title: 'Dune',
                releaseDate: new Date('2021-10-22T00:00:00Z'),
                posterUrl: null,
              },
            ],
            written: [],
            acted: [],
          },
          permissions: { update: false, delete: false },
        }),
      ),
    )
    expect(detail.createdAt).toBeInstanceOf(Date)
    expect(detail.filmography.directed[0]?.releaseDate).toEqual(new Date('2021-10-22T00:00:00Z'))
    expect(detail.permissions).toEqual({ update: false, delete: false })
  })
})
