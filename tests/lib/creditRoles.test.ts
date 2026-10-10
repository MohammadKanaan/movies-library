import { describe, expect, it } from 'vitest'
import { creditRoleLabel, summarizeFilmography } from '@/lib/creditRoles'
import type { CreditRole } from '@/lib/dto/catalog'

const film = (...roles: CreditRole[]) => ({ roles })

describe('creditRoleLabel', () => {
  it('names each role as a film credit reads', () => {
    expect(creditRoleLabel('DIRECTOR')).toBe('Director')
    expect(creditRoleLabel('WRITER')).toBe('Writer')
    expect(creditRoleLabel('ACTOR')).toBe('Actor')
  })
})

describe('summarizeFilmography', () => {
  it('counts the films per role in credit order, leaving out roles never held', () => {
    expect(
      summarizeFilmography([
        film('DIRECTOR', 'WRITER'),
        film('DIRECTOR'),
        film('ACTOR'),
        film('DIRECTOR'),
      ]),
    ).toBe('Directed 3 · Wrote 1 · Acted in 1')
    expect(summarizeFilmography([film('ACTOR'), film('ACTOR')])).toBe('Acted in 2')
  })

  it('is empty without credits', () => {
    expect(summarizeFilmography([])).toBe('')
  })
})
