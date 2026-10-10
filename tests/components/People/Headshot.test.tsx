import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Headshot } from '@/components/People/Headshot'

describe('Headshot', () => {
  it('shows the photo as decoration, since the name is always beside it', () => {
    const { container } = render(
      <Headshot person={{ name: 'Amy Adams', headshotUrl: 'https://pub.example/amy.jpg' }} />,
    )
    const image = container.querySelector('img')
    expect(image).toHaveAttribute('src', 'https://pub.example/amy.jpg')
    expect(image).toHaveAttribute('alt', '')
  })

  it('falls back to hidden initials without a photo', () => {
    const { container } = render(
      <Headshot person={{ name: 'Denis Villeneuve', headshotUrl: null }} size="lg" />,
    )
    expect(container.querySelector('img')).toBeNull()
    expect(container).toHaveTextContent('DV')
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })
})
