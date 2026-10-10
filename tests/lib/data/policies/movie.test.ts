// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { SessionUser } from '@/lib/data/auth'
import { permissionsFor } from '@/lib/data/policy'
import { moviePolicy, type MovieRecord } from '@/lib/data/policies/movie'

const as = (role: SessionUser['role'], id = 'u1'): SessionUser => ({
  id,
  role,
  sessionId: 's1',
  impersonatedBy: null,
})

const ownMovie: MovieRecord = { createdById: 'u1' }
const othersMovie: MovieRecord = { createdById: 'u2' }
const orphanMovie: MovieRecord = { createdById: null }

describe('moviePolicy', () => {
  it('lets an admin update and delete any movie', () => {
    for (const movie of [ownMovie, othersMovie, orphanMovie]) {
      expect(permissionsFor(moviePolicy, ['update', 'delete'], as('admin'), movie)).toEqual({
        update: true,
        delete: true,
      })
    }
  })

  it('lets nobody else write, not even the editor who created it', () => {
    for (const viewer of [null, as('viewer'), as('editor')]) {
      for (const movie of [ownMovie, othersMovie, orphanMovie]) {
        expect(permissionsFor(moviePolicy, ['update', 'delete'], viewer, movie)).toEqual({
          update: false,
          delete: false,
        })
      }
    }
  })
})
