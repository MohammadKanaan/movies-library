import { describe, expect, it } from 'vitest'
import { creditRoleLabel, summarizeFilmography } from '@/lib/creditRoles'

describe('creditRoleLabel', () => {
  it('names each role as a film credit reads', () => {
    expect(creditRoleLabel('DIRECTOR')).toBe('Director')
    expect(creditRoleLabel('WRITER')).toBe('Writer')
    expect(creditRoleLabel('ACTOR')).toBe('Actor')
  })
})

describe('summarizeFilmography', () => {
  it('counts the films per role in credit order, leaving out roles never held', () => {
    expect(summarizeFilmography({ DIRECTOR: 3, WRITER: 1, ACTOR: 1 })).toBe(
      'Directed 3 · Wrote 1 · Acted in 1',
    )
    expect(summarizeFilmography({ DIRECTOR: 0, WRITER: 0, ACTOR: 2 })).toBe('Acted in 2')
  })

  it('is empty without credits', () => {
    expect(summarizeFilmography({ DIRECTOR: 0, WRITER: 0, ACTOR: 0 })).toBe('')
  })
})
