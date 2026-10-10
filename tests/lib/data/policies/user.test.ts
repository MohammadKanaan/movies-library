// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { SessionUser } from '@/lib/data/auth'
import { permissionsFor } from '@/lib/data/policy'
import { userPolicy, type UserRecord } from '@/lib/data/policies/user'

const as = (role: SessionUser['role'], id = 'u1'): SessionUser => ({
  id,
  role,
  sessionId: 's1',
  impersonatedBy: null,
})

const permissions = (viewer: SessionUser | null, record: UserRecord) =>
  permissionsFor(userPolicy, ['setRole', 'ban'], viewer, record)

describe('userPolicy', () => {
  it('gives nothing to a signed-out visitor, a viewer or an editor', () => {
    const viewer: UserRecord = { id: 'u2', role: 'viewer' }
    expect(permissions(null, viewer)).toEqual({ setRole: false, ban: false })
    for (const role of ['viewer', 'editor'] as const) {
      expect(permissions(as(role), viewer)).toEqual({ setRole: false, ban: false })
    }
  })

  it('lets an admin manage a viewer or an editor', () => {
    for (const role of ['viewer', 'editor'] as const) {
      expect(permissions(as('admin'), { id: 'u2', role })).toEqual({ setRole: true, ban: true })
    }
  })

  it('never lets an admin act on their own account or on another admin', () => {
    expect(permissions(as('admin'), { id: 'u1', role: 'admin' })).toEqual({
      setRole: false,
      ban: false,
    })
    expect(permissions(as('admin'), { id: 'u2', role: 'admin' })).toEqual({
      setRole: false,
      ban: false,
    })
  })
})
