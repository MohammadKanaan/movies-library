import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PersonCard } from '@/components/People/PersonCard'
import type { PersonListItem } from '@/lib/dto/people'

const denis: PersonListItem = {
  id: '0190d1a2-0000-7000-8000-000000000001',
  slug: 'denis-villeneuve',
  name: 'Denis Villeneuve',
  headshotUrl: null,
  creditCount: 4,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
}

describe('PersonCard', () => {
  it('links to the person and reads as their name and credit count', () => {
    render(<PersonCard person={denis} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/people/denis-villeneuve')
    expect(link).toHaveAccessibleName('Denis Villeneuve 4 credits')
  })

  it('counts a single credit in the singular', () => {
    render(<PersonCard person={{ ...denis, creditCount: 1 }} />)
    expect(screen.getByRole('link')).toHaveAccessibleName('Denis Villeneuve 1 credit')
  })
})
