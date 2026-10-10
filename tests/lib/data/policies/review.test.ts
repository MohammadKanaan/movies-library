// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { SessionUser } from '@/lib/data/auth'
import { permissionsFor } from '@/lib/data/policy'
import { reviewPolicy, type ReviewRecord } from '@/lib/data/policies/review'

const as = (role: SessionUser['role'], id = 'u1'): SessionUser => ({
  id,
  role,
  sessionId: 's1',
  impersonatedBy: null,
})

const review: ReviewRecord = { authorId: 'u1' }
const permissions = (viewer: SessionUser | null) =>
  permissionsFor(reviewPolicy, ['update', 'delete'], viewer, review)

describe('reviewPolicy', () => {
  it('gives nothing to a signed-out visitor', () => {
    expect(permissions(null)).toEqual({ update: false, delete: false })
  })

  it('lets the author update and delete, whatever their role', () => {
    for (const role of ['viewer', 'editor', 'admin'] as const) {
      expect(permissions(as(role, 'u1'))).toEqual({ update: true, delete: true })
    }
  })

  it('gives another viewer or editor nothing', () => {
    for (const role of ['viewer', 'editor'] as const) {
      expect(permissions(as(role, 'u2'))).toEqual({ update: false, delete: false })
    }
  })

  it('lets an admin delete another’s review but never edit it', () => {
    expect(permissions(as('admin', 'u2'))).toEqual({ update: false, delete: true })
  })
})
