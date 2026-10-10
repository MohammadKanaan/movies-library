import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MovieForm } from '@/components/Admin/Movies/MovieForm'
import type { PersonPickerProps } from '@/components/Admin/Movies/PersonPicker'
import type { GenreWithCount } from '@/lib/dto/genres'
import type { MovieDetail } from '@/lib/dto/movies'
import type { ActionResult } from '@/types/api'

const PERSON_ID = '11111111-1111-4111-8111-111111111111'
const GENRE_ID = '22222222-2222-4222-8222-222222222222'
const OTHER_GENRE_ID = '33333333-3333-4333-8333-333333333333'

vi.mock('@/components/Admin/Movies/PersonPicker', () => ({
  PersonPicker: ({ label, onPick }: PersonPickerProps) => (
    <button
      type="button"
      onClick={() => onPick({ id: PERSON_ID, slug: 'x', name: 'Zendaya', headshotUrl: null })}
    >
      {label}
    </button>
  ),
}))

const genres: GenreWithCount[] = [
  { id: GENRE_ID, name: 'Drama', slug: 'drama', movieCount: 3 },
  { id: OTHER_GENRE_ID, name: 'Comedy', slug: 'comedy', movieCount: 1 },
]

const person = (id: string, name: string) => ({ id, slug: id, name, headshotUrl: null })

const movie: MovieDetail = {
  id: '44444444-4444-4444-8444-444444444444',
  slug: 'dune-2021',
  title: 'Dune',
  synopsis: 'A boy on a desert planet.',
  releaseDate: new Date('2021-10-22T00:00:00.000Z'),
  runtimeMinutes: 155,
  posterUrl: null,
  genres: [{ id: GENRE_ID, name: 'Drama', slug: 'drama' }],
  credits: {
    directors: [person('a0000000-0000-4000-8000-000000000001', 'Denis Villeneuve')],
    writers: [
      person('a0000000-0000-4000-8000-000000000002', 'Jon Spaihts'),
      person('a0000000-0000-4000-8000-000000000003', 'Eric Roth'),
    ],
    cast: [
      person('a0000000-0000-4000-8000-000000000004', 'Timothee Chalamet'),
      person('a0000000-0000-4000-8000-000000000005', 'Rebecca Ferguson'),
    ],
  },
  createdBy: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  permissions: { update: true, delete: true },
}

const saved = (overrides: Partial<MovieDetail> = {}): ActionResult<MovieDetail> => ({
  ok: true,
  data: { ...movie, ...overrides },
})

const failure = (
  code: 'VALIDATION' | 'FORBIDDEN',
  message: string,
  fieldErrors?: Record<string, string[]>,
) => ({ ok: false as const, code, message, fieldErrors })

describe('MovieForm', () => {
  describe('create mode', () => {
    it('submits the full movie input and reports the saved movie', async () => {
      const onSubmit = vi.fn(async () => saved())
      const onSaved = vi.fn()
      render(<MovieForm genres={genres} onSubmit={onSubmit} onSaved={onSaved} />)

      await userEvent.type(screen.getByLabelText(/Title/), '  Dune  ')
      await userEvent.type(screen.getByLabelText(/Release date/), '2021-10-22')
      await userEvent.type(screen.getByLabelText(/Runtime/), '155')
      await userEvent.type(screen.getByLabelText(/Synopsis/), 'A boy on a desert planet.')
      await userEvent.click(screen.getByRole('checkbox', { name: 'Drama' }))
      await userEvent.click(screen.getByRole('button', { name: 'Add a cast member' }))
      expect(screen.getByText('Zendaya')).toBeInTheDocument()
      await userEvent.click(screen.getByRole('button', { name: 'Create movie' }))

      await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Dune',
        synopsis: 'A boy on a desert planet.',
        releaseDate: '2021-10-22',
        runtimeMinutes: 155,
        genreIds: [GENRE_ID],
        credits: [{ personId: PERSON_ID, role: 'ACTOR' }],
      })
      await vi.waitFor(() => expect(onSaved).toHaveBeenCalledWith(expect.objectContaining(movie)))
    })

    it('submits an empty runtime and an empty synopsis as null', async () => {
      const onSubmit = vi.fn(async () => saved())
      render(<MovieForm genres={genres} onSubmit={onSubmit} />)

      await userEvent.type(screen.getByLabelText(/Title/), 'Dune')
      await userEvent.type(screen.getByLabelText(/Release date/), '2021-10-22')
      await userEvent.click(screen.getByRole('button', { name: 'Create movie' }))

      await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Dune',
        synopsis: null,
        releaseDate: '2021-10-22',
        runtimeMinutes: null,
        genreIds: [],
        credits: [],
      })
    })

    it('refuses an empty title before calling the action', async () => {
      const onSubmit = vi.fn()
      render(<MovieForm genres={genres} onSubmit={onSubmit} />)

      await userEvent.type(screen.getByLabelText(/Release date/), '2021-10-22')
      await userEvent.click(screen.getByRole('button', { name: 'Create movie' }))

      expect(await screen.findByText('Title is required')).toBeInTheDocument()
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('refuses a release date in the future', async () => {
      const onSubmit = vi.fn()
      render(<MovieForm genres={genres} onSubmit={onSubmit} />)

      await userEvent.type(screen.getByLabelText(/Title/), 'Dune')
      await userEvent.type(screen.getByLabelText(/Release date/), '2999-01-01')
      await userEvent.click(screen.getByRole('button', { name: 'Create movie' }))

      expect(
        await screen.findByText('Enter a release date between 1888 and today'),
      ).toBeInTheDocument()
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('uses the given submit label', () => {
      render(<MovieForm genres={genres} onSubmit={vi.fn()} submitLabel="Add the movie" />)
      expect(screen.getByRole('button', { name: 'Add the movie' })).toBeInTheDocument()
    })
  })

  describe('edit mode', () => {
    it('hydrates every field from the movie', () => {
      render(<MovieForm genres={genres} movie={movie} onSubmit={vi.fn()} />)

      expect(screen.getByLabelText(/Title/)).toHaveValue('Dune')
      expect(screen.getByLabelText(/Release date/)).toHaveValue('2021-10-22')
      expect(screen.getByLabelText(/Runtime/)).toHaveValue(155)
      expect(screen.getByLabelText(/Synopsis/)).toHaveValue('A boy on a desert planet.')
      expect(screen.getByRole('checkbox', { name: 'Drama' })).toBeChecked()
      expect(screen.getByRole('checkbox', { name: 'Comedy' })).not.toBeChecked()

      const names = (heading: string) => {
        const section = screen.getByRole('heading', { name: heading }).closest('section')
        return within(section as HTMLElement)
          .getAllByRole('listitem')
          .map((item) => item.textContent)
      }
      expect(names('Directors')).toEqual([expect.stringContaining('Denis Villeneuve')])
      expect(names('Writers')).toEqual([
        expect.stringContaining('Jon Spaihts'),
        expect.stringContaining('Eric Roth'),
      ])
      expect(names('Cast')).toEqual([
        expect.stringContaining('Timothee Chalamet'),
        expect.stringContaining('Rebecca Ferguson'),
      ])
    })

    it('keeps the submit button disabled until something changes, then sends the full input', async () => {
      const onSubmit = vi.fn(async () => saved({ title: 'Dune: Part One' }))
      const onSaved = vi.fn()
      render(<MovieForm genres={genres} movie={movie} onSubmit={onSubmit} onSaved={onSaved} />)

      const submit = screen.getByRole('button', { name: 'Save changes' })
      expect(submit).toBeDisabled()

      const title = screen.getByLabelText(/Title/)
      await userEvent.clear(title)
      await userEvent.type(title, 'Dune: Part One')
      expect(submit).toBeEnabled()
      await userEvent.click(submit)

      await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Dune: Part One',
        synopsis: 'A boy on a desert planet.',
        releaseDate: '2021-10-22',
        runtimeMinutes: 155,
        genreIds: [GENRE_ID],
        credits: [
          { personId: 'a0000000-0000-4000-8000-000000000001', role: 'DIRECTOR' },
          { personId: 'a0000000-0000-4000-8000-000000000002', role: 'WRITER' },
          { personId: 'a0000000-0000-4000-8000-000000000003', role: 'WRITER' },
          { personId: 'a0000000-0000-4000-8000-000000000004', role: 'ACTOR' },
          { personId: 'a0000000-0000-4000-8000-000000000005', role: 'ACTOR' },
        ],
      })
      await vi.waitFor(() => expect(onSaved).toHaveBeenCalledTimes(1))
      await vi.waitFor(() =>
        expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled(),
      )
    })
  })

  describe('server errors', () => {
    const fillAndSubmit = async () => {
      await userEvent.type(screen.getByLabelText(/Title/), 'Dune')
      await userEvent.type(screen.getByLabelText(/Release date/), '2021-10-22')
      await userEvent.click(screen.getByRole('button', { name: 'Create movie' }))
    }

    it('shows a genre error under the genres group', async () => {
      const onSubmit = vi.fn(async () =>
        failure('VALIDATION', 'Check the form', { genreIds: ['That genre no longer exists'] }),
      )
      render(<MovieForm genres={genres} onSubmit={onSubmit} />)
      await fillAndSubmit()

      const group = screen.getByRole('group', { name: /Genres/ })
      expect(await within(group).findByRole('alert')).toHaveTextContent(
        'That genre no longer exists',
      )
    })

    it('shows a credits error under the credits', async () => {
      const onSubmit = vi.fn(async () =>
        failure('VALIDATION', 'Check the form', {
          credits: ['A credited person no longer exists'],
        }),
      )
      render(<MovieForm genres={genres} onSubmit={onSubmit} />)
      await fillAndSubmit()

      expect(await screen.findByText('A credited person no longer exists')).toHaveAttribute(
        'role',
        'alert',
      )
    })

    it('shows a failure without field errors in the form alert', async () => {
      const onSubmit = vi.fn(async () => failure('FORBIDDEN', 'You cannot edit movies'))
      render(<MovieForm genres={genres} onSubmit={onSubmit} />)
      await fillAndSubmit()

      expect(await screen.findByRole('alert')).toHaveTextContent('You cannot edit movies')
    })
  })
})
