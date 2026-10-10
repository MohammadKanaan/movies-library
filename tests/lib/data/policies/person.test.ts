// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { SessionUser } from '@/lib/data/auth'
import { permissionsFor } from '@/lib/data/policy'
import { personPolicy, type PersonRecord } from '@/lib/data/policies/person'

const as = (role: SessionUser['role']): SessionUser => ({
  id: 'u1',
  role,
  sessionId: 's1',
  impersonatedBy: null,
})

const person: PersonRecord = { id: 'p1' }

describe('personPolicy', () => {
  it('is admin only', () => {
    expect(permissionsFor(personPolicy, ['update', 'delete'], as('admin'), person)).toEqual({
      update: true,
      delete: true,
    })
    for (const viewer of [null, as('viewer'), as('editor')]) {
      expect(permissionsFor(personPolicy, ['update', 'delete'], viewer, person)).toEqual({
        update: false,
        delete: false,
      })
    }
  })
})
