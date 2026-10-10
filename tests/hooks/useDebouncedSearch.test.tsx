import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { RequestError } from '@/lib/client/errors'

type Deferred = { resolve: (value: string) => void; reject: (error: unknown) => void }

describe('useDebouncedSearch', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const flush = async () => {
    await act(async () => {
      await Promise.resolve()
    })
  }

  it('stays idle below the minimum length and never calls the search', () => {
    const search = vi.fn(async () => 'never')
    const { result } = renderHook(() => useDebouncedSearch(search))
    act(() => result.current.setTerm('du'))
    act(() => vi.runAllTimers())
    expect(search).not.toHaveBeenCalled()
    expect(result.current).toMatchObject({ status: 'idle', result: null, error: null })
  })

  it('debounces into one trimmed request and reports its result', async () => {
    const search = vi.fn(async (term: string) => `found ${term}`)
    const { result } = renderHook(() => useDebouncedSearch(search))
    act(() => result.current.setTerm('dun'))
    act(() => result.current.setTerm(' dune '))
    expect(result.current.status).toBe('loading')
    act(() => vi.advanceTimersByTime(250))
    expect(search).toHaveBeenCalledTimes(1)
    expect(search).toHaveBeenCalledWith('dune', expect.any(AbortSignal))
    await flush()
    expect(result.current).toMatchObject({ status: 'done', result: 'found dune', error: null })
  })

  it('aborts the previous request and ignores its late answer', async () => {
    const pending: Deferred[] = []
    const signals: AbortSignal[] = []
    const search = vi.fn(
      (_term: string, signal: AbortSignal) =>
        new Promise<string>((resolve, reject) => {
          signals.push(signal)
          pending.push({ resolve, reject })
        }),
    )
    const { result } = renderHook(() => useDebouncedSearch(search))
    act(() => result.current.setTerm('dune'))
    act(() => vi.advanceTimersByTime(250))
    act(() => result.current.setTerm('dunkirk'))
    act(() => vi.advanceTimersByTime(250))
    expect(search).toHaveBeenCalledTimes(2)
    expect(signals[0]?.aborted).toBe(true)
    expect(signals[1]?.aborted).toBe(false)
    // The first answer arrives late: it must not overwrite the newer search.
    await act(async () => {
      pending[0]?.resolve('stale')
      await Promise.resolve()
    })
    expect(result.current.status).toBe('loading')
    await act(async () => {
      pending[1]?.resolve('fresh')
      await Promise.resolve()
    })
    expect(result.current).toMatchObject({ status: 'done', result: 'fresh' })
  })

  it('reports a RequestError message, or a generic one, and clears it on the next term', async () => {
    const search = vi
      .fn<(term: string, signal: AbortSignal) => Promise<string>>()
      .mockRejectedValueOnce(new RequestError('Too many searches', 429))
      .mockRejectedValueOnce(new Error('network'))
    const { result } = renderHook(() => useDebouncedSearch(search))
    act(() => result.current.setTerm('dune'))
    act(() => vi.advanceTimersByTime(250))
    await flush()
    expect(result.current).toMatchObject({
      status: 'done',
      result: null,
      error: 'Too many searches',
    })
    act(() => result.current.setTerm('dunes'))
    expect(result.current.error).toBeNull()
    act(() => vi.advanceTimersByTime(250))
    await flush()
    expect(result.current.error).toBe('The search failed. Try again.')
  })

  it('keeps the last result while the next search loads, and reset drops everything', async () => {
    const search = vi.fn(async (term: string) => term)
    const { result } = renderHook(() => useDebouncedSearch(search))
    act(() => result.current.setTerm('dune'))
    act(() => vi.advanceTimersByTime(250))
    await flush()
    act(() => result.current.setTerm('dunes'))
    expect(result.current).toMatchObject({ status: 'loading', result: 'dune' })
    act(() => result.current.reset())
    expect(result.current).toMatchObject({ status: 'idle', result: null, error: null })
    act(() => vi.runAllTimers())
    expect(search).toHaveBeenCalledTimes(1)
  })

  it('aborts a pending request on unmount', () => {
    let signal: AbortSignal | undefined
    const search = vi.fn((_term: string, s: AbortSignal) => {
      signal = s
      return new Promise<string>(() => {})
    })
    const { result, unmount } = renderHook(() => useDebouncedSearch(search))
    act(() => result.current.setTerm('dune'))
    act(() => vi.advanceTimersByTime(250))
    unmount()
    expect(signal?.aborted).toBe(true)
  })
})
