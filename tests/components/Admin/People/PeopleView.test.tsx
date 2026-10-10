import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { createPersonAction, deletePersonAction, updatePersonAction } from '@/actions/people'
import { PeopleView } from '@/components/Admin/People/PeopleView'
import type { Page } from '@/lib/dto/common'
import type { PersonListItem } from '@/lib/dto/people'

const navigation = vi.hoisted(() => ({ search: '', replace: vi.fn() }))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: navigation.replace }),
  usePathname: () => '/admin/people',
  useSearchParams: () => new URLSearchParams(navigation.search),
}))
vi.mock('@/actions/people', () => ({
  createPersonAction: vi.fn(),
  updatePersonAction: vi.fn(),
  deletePersonAction: vi.fn(),
  attachHeadshotAction: vi.fn(),
  removeHeadshotAction: vi.fn(),
}))
vi.mock('@/actions/uploads', () => ({ createUploadAction: vi.fn() }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const DENIS_ID = '0190d1a2-0000-7000-8000-000000000001'
const AMY_ID = '0190d1a2-0000-7000-8000-000000000002'

const denis: PersonListItem = {
  id: DENIS_ID,
  slug: 'denis-villeneuve',
  name: 'Denis Villeneuve',
  headshotUrl: null,
  creditCount: 4,
  createdAt: new Date('2026-10-05T15:04:00.000Z'),
}
const amy: PersonListItem = {
  id: AMY_ID,
  slug: 'amy-adams',
  name: 'Amy Adams',
  headshotUrl: null,
  creditCount: 0,
  createdAt: new Date('2026-10-06T15:04:00.000Z'),
}

const page = (
  items: PersonListItem[],
  overrides: Partial<Page<PersonListItem>> = {},
): Page<PersonListItem> => ({
  items,
  page: 1,
  perPage: 20,
  totalItems: items.length,
  totalPages: 1,
  ...overrides,
})

const rows = () => screen.getAllByRole('row').slice(1)
const rowOf = (name: string) => {
  const row = rows().find((candidate) => within(candidate).queryByText(name))
  if (!row) {
    throw new Error(`No row for ${name}`)
  }
  return row
}

describe('PeopleView', () => {
  beforeEach(() => {
    navigation.search = ''
    navigation.replace.mockReset()
    vi.mocked(createPersonAction).mockReset()
    vi.mocked(updatePersonAction).mockReset()
    vi.mocked(deletePersonAction).mockReset()
    vi.mocked(toast.success).mockReset()
  })

  it('sorts credit counts without dropping the search or retaining a later page', async () => {
    navigation.search = 'page=3&q=amy'
    render(<PeopleView people={page([amy])} canUpload />)
    await userEvent.click(screen.getByRole('button', { name: 'Credits' }))
    const params = new URLSearchParams(navigation.replace.mock.lastCall?.[0].split('?')[1])
    expect(Object.fromEntries(params)).toEqual({ q: 'amy', sortBy: 'creditCount' })
  })

  it('lists people with their slug, credit count and creation date', () => {
    render(<PeopleView people={page([amy, denis])} canUpload />)
    const row = rowOf('Denis Villeneuve')
    expect(within(row).getByText('denis-villeneuve')).toBeInTheDocument()
    expect(within(row).getByRole('link', { name: '4' })).toHaveAttribute(
      'href',
      '/movies?person=denis-villeneuve',
    )
    expect(within(row).getByText('Oct 5, 2026')).toBeInTheDocument()
    expect(within(rowOf('Amy Adams')).getByText('0')).toBeInTheDocument()
  })

  it("opens a person's photo dialog from their row", async () => {
    render(<PeopleView people={page([amy, denis])} canUpload />)
    await userEvent.click(within(rowOf('Amy Adams')).getByRole('button', { name: 'Photo' }))
    expect(await screen.findByRole('dialog', { name: 'Photo of Amy Adams' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Upload photo' })).toBeInTheDocument()
  })

  it('writes the search to the URL, back on page 1, and shows the term from the URL', async () => {
    navigation.search = 'page=2'
    render(<PeopleView people={page([amy], { page: 2, totalPages: 3 })} canUpload />)
    await userEvent.type(screen.getByLabelText('Search people'), ' amy ')
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(navigation.replace).toHaveBeenCalledWith('/admin/people?q=amy', { scroll: false })
  })

  it('adds a person through a dialog and confirms', async () => {
    vi.mocked(createPersonAction).mockResolvedValue({
      ok: true,
      data: {
        id: 'p3',
        slug: 'greta-gerwig',
        name: 'Greta Gerwig',
        headshotUrl: null,
        bio: null,
        birthDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        roleCounts: { DIRECTOR: 0, WRITER: 0, ACTOR: 0 },
        permissions: { update: true, delete: true },
      },
    })
    render(<PeopleView people={page([amy])} canUpload />)
    await userEvent.click(screen.getByRole('button', { name: 'Add person' }))
    await userEvent.type(await screen.findByLabelText(/Name/), 'Greta Gerwig')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    await vi.waitFor(() =>
      expect(createPersonAction).toHaveBeenCalledWith({ name: 'Greta Gerwig' }),
    )
    expect(toast.success).toHaveBeenCalledWith('Greta Gerwig added')
  })

  it('renames a person through a dialog', async () => {
    vi.mocked(updatePersonAction).mockResolvedValue({
      ok: true,
      data: {
        ...amy,
        name: 'Amy Lou Adams',
        bio: null,
        birthDate: null,
        updatedAt: new Date(),
        roleCounts: { DIRECTOR: 0, WRITER: 0, ACTOR: 0 },
        permissions: { update: true, delete: true },
      },
    })
    render(<PeopleView people={page([amy])} canUpload />)
    await userEvent.click(
      within(rowOf('Amy Adams')).getByRole('button', { name: 'Rename Amy Adams' }),
    )
    const field = await screen.findByLabelText(/Name/)
    expect(field).toHaveValue('Amy Adams')
    await userEvent.clear(field)
    await userEvent.type(field, 'Amy Lou Adams')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await vi.waitFor(() =>
      expect(updatePersonAction).toHaveBeenCalledWith({ id: AMY_ID, name: 'Amy Lou Adams' }),
    )
    expect(toast.success).toHaveBeenCalledWith('Person renamed')
  })

  it('deletes an uncredited person after confirmation and disables Delete for a credited one', async () => {
    vi.mocked(deletePersonAction).mockResolvedValue({ ok: true, data: undefined })
    render(<PeopleView people={page([amy, denis])} canUpload />)
    const credited = within(rowOf('Denis Villeneuve')).getByRole('button', {
      name: 'Delete Denis Villeneuve',
    })
    expect(credited).toBeDisabled()
    expect(credited).toHaveAccessibleDescription('Remove the person from their credits first')

    await userEvent.click(
      within(rowOf('Amy Adams')).getByRole('button', { name: 'Delete Amy Adams' }),
    )
    await userEvent.click(await screen.findByRole('button', { name: 'Delete person' }))
    await vi.waitFor(() => expect(deletePersonAction).toHaveBeenCalledWith(AMY_ID))
    expect(toast.success).toHaveBeenCalledWith('Amy Adams deleted')
  })

  it('pages through the URL and says so when nothing matches', async () => {
    const { rerender } = render(
      <PeopleView people={page([amy], { totalItems: 45, totalPages: 3 })} canUpload />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(navigation.replace).toHaveBeenCalledWith('/admin/people?page=2', { scroll: false })

    navigation.search = 'q=zzz'
    rerender(<PeopleView people={page([], { totalItems: 0 })} canUpload />)
    expect(screen.getByText('No people found')).toBeInTheDocument()
    expect(screen.getByText('No one matches your search.')).toBeInTheDocument()
  })
})
