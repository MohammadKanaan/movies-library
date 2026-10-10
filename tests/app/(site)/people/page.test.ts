// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import PeoplePage from '@/app/(site)/people/page'
import { PEOPLE_LIST_HIDDEN } from '@/lib/constants-routes'

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect ${path}`)
  }),
}))
vi.mock('next/navigation', () => ({ redirect }))
vi.mock('@/lib/data/people', () => ({ listPeople: vi.fn() }))

const visit = (searchParams: Record<string, string>) =>
  PeoplePage({ params: Promise.resolve({}), searchParams: Promise.resolve(searchParams) })

describe.runIf(PEOPLE_LIST_HIDDEN)('PeoplePage while the list is hidden', () => {
  it('sends a name search to the site search, keeping the term', async () => {
    await expect(visit({ q: 'amy adams' })).rejects.toThrow('redirect /search?q=amy+adams')
  })

  it('sends the bare list to the search page', async () => {
    await expect(visit({})).rejects.toThrow('redirect /search')
  })
})
