import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RangeFilter, type Range } from '@/components/Movies/RangeFilter'

// jsdom never measures the slider, so its thumbs stay `visibility: hidden` and keys do not move
// them: the tests find the thumbs by their label and set their value, as assistive tech does.
const thumbs = () =>
  screen.getAllByLabelText('Runtime').filter((element) => element instanceof HTMLInputElement)

const setup = (value: Range) => {
  const onChange = vi.fn()
  render(
    <RangeFilter
      label="Runtime"
      min={0}
      max={240}
      step={5}
      largeStep={30}
      value={value}
      onChange={onChange}
      readout="Any length"
      minLabel="0 min"
      maxLabel="240+ min"
    />,
  )
  return onChange
}

describe('RangeFilter', () => {
  it('puts an unbounded side at its end of the slider', () => {
    setup({ from: 90, to: null })
    const [start, end] = thumbs()
    expect(start).toHaveAttribute('aria-valuenow', '90')
    expect(end).toHaveAttribute('aria-valuenow', '240')
    expect(screen.getByText('Any length')).toBeInTheDocument()
  })

  it('reports a thumb moved inside the slider as a bound', () => {
    const onChange = setup({ from: null, to: null })
    fireEvent.change(thumbs()[1]!, { target: { value: '150' } })
    expect(onChange).toHaveBeenLastCalledWith({ from: null, to: 150 })
  })

  it('reports a thumb moved to its end as no bound', () => {
    const onChange = setup({ from: 90, to: 150 })
    fireEvent.change(thumbs()[0]!, { target: { value: '0' } })
    expect(onChange).toHaveBeenLastCalledWith({ from: null, to: 150 })
  })
})
