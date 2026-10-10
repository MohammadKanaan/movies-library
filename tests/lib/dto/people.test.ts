import { describe, expect, it } from 'vitest'
import { MAX_PAGE } from '@/lib/dto/common'
import {
  listPeopleQuery,
  PEOPLE_SEARCH_MAX_LENGTH,
  peopleUrlQuery,
  PERSON_BIO_MAX_LENGTH,
  PERSON_BIRTH_MIN,
  PERSON_NAME_MAX_LENGTH,
  attachHeadshotInput,
  personDetailSchema,
  personInput,
  personListItemSchema,
  personSummarySchema,
  updatePersonInput,
} from '@/lib/dto/people'

const ID = '0190d1a2-0000-7000-8000-000000000001'
const MOVIE_ID = '0190d1a2-0000-7000-8000-000000000002'

const today = () => new Date().toISOString().slice(0, 10)

describe('personInput', () => {
  it('trims and bounds the name', () => {
    expect(personInput.parse({ name: '  Denis Villeneuve ' })).toEqual({ name: 'Denis Villeneuve' })
    expect(personInput.safeParse({ name: '' }).error?.issues[0]?.message).toBe('Name is required')
    expect(personInput.safeParse({ name: 'a'.repeat(PERSON_NAME_MAX_LENGTH + 1) }).success).toBe(
      false,
    )
  })

  it('leaves an absent bio and birth date out, so an update keeps them', () => {
    const parsed = personInput.parse({ name: 'Greta Gerwig' })
    expect(parsed).not.toHaveProperty('bio')
    expect(parsed).not.toHaveProperty('birthDate')
  })

  it('trims and bounds the bio, clearing it when blank', () => {
    expect(personInput.parse({ name: 'A', bio: '  Born in Sacramento.  ' }).bio).toBe(
      'Born in Sacramento.',
    )
    expect(personInput.parse({ name: 'A', bio: '   ' }).bio).toBeNull()
    expect(personInput.parse({ name: 'A', bio: null }).bio).toBeNull()
    expect(
      personInput.safeParse({ name: 'A', bio: 'a'.repeat(PERSON_BIO_MAX_LENGTH + 1) }).error
        ?.issues[0]?.message,
    ).toBe(`Bio must be ${PERSON_BIO_MAX_LENGTH} characters or fewer`)
  })

  it('takes a birth date as a calendar day between 1800 and today, or null to clear it', () => {
    expect(personInput.parse({ name: 'A', birthDate: '1983-08-04' }).birthDate).toBe('1983-08-04')
    expect(personInput.parse({ name: 'A', birthDate: PERSON_BIRTH_MIN }).birthDate).toBe(
      PERSON_BIRTH_MIN,
    )
    expect(personInput.parse({ name: 'A', birthDate: today() }).birthDate).toBe(today())
    expect(personInput.parse({ name: 'A', birthDate: null }).birthDate).toBeNull()
    expect(
      personInput.safeParse({ name: 'A', birthDate: '04/08/1983' }).error?.issues[0]?.message,
    ).toBe('Enter a birth date as YYYY-MM-DD')
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10)
    for (const birthDate of ['1799-12-31', tomorrow]) {
      expect(personInput.safeParse({ name: 'A', birthDate }).error?.issues[0]?.message).toBe(
        'Enter a birth date between 1800 and today',
      )
    }
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

describe('attachHeadshotInput', () => {
  it('takes a person id and an upload key', () => {
    const key = `headshots/${crypto.randomUUID()}/${crypto.randomUUID()}`
    expect(attachHeadshotInput.parse({ id: ID, key })).toEqual({ id: ID, key })
    expect(attachHeadshotInput.safeParse({ id: 'nope', key }).success).toBe(false)
    expect(attachHeadshotInput.safeParse({ id: ID, key: 'nope' }).success).toBe(false)
  })
})

describe('person outputs', () => {
  const summary = {
    id: ID,
    slug: 'denis-villeneuve',
    name: 'Denis Villeneuve',
    headshotUrl: null,
  }

  it('summarise a person as id, slug, name and headshot', () => {
    expect(personSummarySchema.parse(summary)).toEqual(summary)
    expect(personSummarySchema.safeParse({ id: ID, slug: 's', name: 'n' }).success).toBe(false)
  })

  it('list a person with how many credits they hold and when they were added', () => {
    const item = personListItemSchema.parse(
      JSON.parse(
        JSON.stringify({ ...summary, creditCount: 3, createdAt: new Date('2026-01-01T00:00:00Z') }),
      ),
    )
    expect(item).toEqual({
      ...summary,
      creditCount: 3,
      createdAt: new Date('2026-01-01T00:00:00Z'),
    })
    expect(personListItemSchema.safeParse(summary).success).toBe(false)
    expect(personListItemSchema.safeParse({ ...item, creditCount: 1.5 }).success).toBe(false)
  })

  it('revive dates in the detail and its filmography after a JSON round trip', () => {
    const detail = personDetailSchema.parse(
      JSON.parse(
        JSON.stringify({
          ...summary,
          bio: 'Canadian filmmaker.',
          birthDate: new Date('1967-10-03T00:00:00Z'),
          createdAt: new Date('2026-01-01T00:00:00Z'),
          updatedAt: new Date('2026-01-02T00:00:00Z'),
          filmography: [
            {
              id: MOVIE_ID,
              slug: 'dune-2021',
              title: 'Dune',
              releaseDate: new Date('2021-10-22T00:00:00Z'),
              runtimeMinutes: 155,
              posterUrl: null,
              genres: [{ id: 'g1', name: 'Drama', slug: 'drama' }],
              roles: ['DIRECTOR', 'WRITER'],
            },
          ],
          permissions: { update: false, delete: false },
        }),
      ),
    )
    expect(detail.createdAt).toBeInstanceOf(Date)
    expect(detail.birthDate).toEqual(new Date('1967-10-03T00:00:00Z'))
    expect(detail.filmography[0]?.releaseDate).toEqual(new Date('2021-10-22T00:00:00Z'))
    expect(detail.filmography[0]?.roles).toEqual(['DIRECTOR', 'WRITER'])
    expect(detail.permissions).toEqual({ update: false, delete: false })
  })

  it('refuse a filmography entry without a role', () => {
    const entry = {
      id: MOVIE_ID,
      slug: 'dune-2021',
      title: 'Dune',
      releaseDate: new Date('2021-10-22T00:00:00Z'),
      runtimeMinutes: null,
      posterUrl: null,
      genres: [],
      roles: [],
    }
    expect(personDetailSchema.shape.filmography.safeParse([entry]).success).toBe(false)
  })
})
