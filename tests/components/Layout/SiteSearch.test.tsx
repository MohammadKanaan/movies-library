import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ComponentProps } from 'react'
import { SiteSearch } from '@/components/Layout/SiteSearch'
import { searchCatalog } from '@/lib/client/search'
import type { SearchResults } from '@/lib/dto/search'

const navigation = vi.hoisted(() => ({ push: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: navigation.push }) }))
// Next's Form needs the app router; a plain form submits the same way for the test.
vi.mock('next/form', () => ({
  default: ({ action, ...props }: ComponentProps<'form'>) => (
    <form action={typeof action === 'string' ? action : undefined} {...props} />
  ),
}))
vi.mock('@/lib/client/search', () => ({ searchCatalog: vi.fn(), SEARCH_SUGGESTIONS_LIMIT: 5 }))

const results: SearchResults = {
  q: 'dun',
  movies: {
    items: [
      {
        id: 'm1',
        slug: 'dune-2021',
        title: 'Dune',
        releaseDate: new Date('2021-10-22T00:00:00.000Z'),
        runtimeMinutes: 155,
        posterUrl: null,
        genres: [],
      },
    ],
    totalItems: 3,
  },
  people: {
    items: [
      {
        id: 'p1',
        slug: 'dunia-ayaso',
        name: 'Dunia Ayaso',
        headshotUrl: null,
        creditCount: 2,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    ],
    totalItems: 1,
  },
}

const nothing: SearchResults = {
  q: 'zzz',
  movies: { items: [], totalItems: 0 },
  people: { items: [], totalItems: 0 },
}

const box = () => screen.getByRole('combobox', { name: 'Search movies and people' })

describe('SiteSearch', () => {
  beforeEach(() => {
    navigation.push.mockReset()
    vi.mocked(searchCatalog).mockReset().mockResolvedValue(results)
  })

  it('searches nothing below three characters and shows the hint', async () => {
    render(<SiteSearch />)
    await userEvent.type(box(), 'du')
    expect(await screen.findByText('Type at least 3 characters')).toBeInTheDocument()
    expect(searchCatalog).not.toHaveBeenCalled()
  })

  it('suggests movies, people and "see all" once the term is long enough', async () => {
    render(<SiteSearch />)
    await userEvent.type(box(), 'dun')
    expect(await screen.findByRole('option', { name: /Dune/ })).toHaveTextContent('2021 · Movie')
    expect(screen.getByRole('option', { name: /Dunia Ayaso/ })).toHaveTextContent('2 credits')
    expect(screen.getByRole('option', { name: 'See all results for “dun”' })).toBeInTheDocument()
    expect(searchCatalog).toHaveBeenCalledTimes(1)
    expect(searchCatalog).toHaveBeenCalledWith('dun', expect.any(AbortSignal))
  })

  it('opens the picked suggestion and clears the box', async () => {
    const onNavigate = vi.fn()
    render(<SiteSearch onNavigate={onNavigate} />)
    await userEvent.type(box(), 'dun')
    await userEvent.click(await screen.findByRole('option', { name: /Dunia Ayaso/ }))
    expect(navigation.push).toHaveBeenCalledWith('/people/dunia-ayaso')
    expect(onNavigate).toHaveBeenCalledTimes(1)
    expect(box()).toHaveValue('')
  })

  it('opens the search page from the "see all" suggestion', async () => {
    render(<SiteSearch />)
    await userEvent.type(box(), 'dun')
    await userEvent.click(await screen.findByRole('option', { name: 'See all results for “dun”' }))
    expect(navigation.push).toHaveBeenCalledWith('/search?q=dun')
  })

  it('submits to the search page with the term when nothing is picked', async () => {
    render(<SiteSearch />)
    const form = screen.getByRole('search')
    expect(form).toHaveAttribute('action', '/search')
    expect(box()).toHaveAttribute('name', 'q')
    const submit = vi.fn((event: Event) => event.preventDefault())
    form.addEventListener('submit', submit)
    await userEvent.type(box(), 'dune{Enter}')
    expect(submit).toHaveBeenCalledTimes(1)
    expect(navigation.push).not.toHaveBeenCalled()
  })

  it('says when nothing matches, without a "see all"', async () => {
    vi.mocked(searchCatalog).mockResolvedValue(nothing)
    render(<SiteSearch />)
    await userEvent.type(box(), 'zzz')
    expect(await screen.findByText('Nothing found for “zzz”')).toBeInTheDocument()
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  it('shows the failure message', async () => {
    vi.mocked(searchCatalog).mockRejectedValue(new Error('boom'))
    render(<SiteSearch />)
    await userEvent.type(box(), 'dune')
    expect(await screen.findByRole('alert')).toHaveTextContent('The search failed. Try again.')
  })
})
