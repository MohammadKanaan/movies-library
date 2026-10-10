// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { SessionUser } from '@/lib/data/auth'
import { permissionsFor } from '@/lib/data/policy'
import { genrePolicy, type GenreRecord } from '@/lib/data/policies/genre'

const as = (role: SessionUser['role']): SessionUser => ({
  id: 'u1',
  role,
  sessionId: 's1',
  impersonatedBy: null,
})

const genre: GenreRecord = { id: 'g1' }

describe('genrePolicy', () => {
  it('is admin only', () => {
    expect(permissionsFor(genrePolicy, ['update', 'delete'], as('admin'), genre)).toEqual({
      update: true,
      delete: true,
    })
    for (const viewer of [null, as('viewer'), as('editor')]) {
      expect(permissionsFor(genrePolicy, ['update', 'delete'], viewer, genre)).toEqual({
        update: false,
        delete: false,
      })
    }
  })
})
