'use client'

import { useEffect, useRef, useState } from 'react'
import { RequestError } from '@/lib/client/errors'
import { SEARCH_MIN_LENGTH } from '@/lib/dto/common'

const SEARCH_DEBOUNCE_MS = 250

type SearchState<T> = {
  /** `idle` below the minimum length, `loading` while a request is pending or debounced. */
  status: 'idle' | 'loading' | 'done'
  /** The last completed search's result; kept while the next one loads so a list does not flicker. */
  result: T | null
  /** The last search's failure message, cleared by the next keystroke. */
  error: string | null
}

type Options = {
  /** Terms shorter than this are not searched (the trigram indexes' floor by default). */
  minLength?: number
  debounceMs?: number
}

// A DOMException is not always an `Error` (jsdom), so go by its name.
const isAbort = (error: unknown) =>
  typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError'

/**
 * A typeahead's remote search: `setTerm` debounces the request, aborts the previous one and ignores
 * a response that arrives after a newer request was issued. `search` receives the trimmed term and
 * the request's `AbortSignal`; `reset` cancels everything and returns to idle. The pending request is
 * aborted when the component unmounts.
 */
export const useDebouncedSearch = <T>(
  search: (term: string, signal: AbortSignal) => Promise<T>,
  { minLength = SEARCH_MIN_LENGTH, debounceMs = SEARCH_DEBOUNCE_MS }: Options = {},
) => {
  const [state, setState] = useState<SearchState<T>>({ status: 'idle', result: null, error: null })
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const controller = useRef<AbortController | null>(null)

  const cancel = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
    controller.current?.abort()
    controller.current = null
  }

  useEffect(() => cancel, [])

  const run = async (term: string) => {
    const current = new AbortController()
    controller.current = current
    try {
      const result = await search(term, current.signal)
      if (controller.current === current) {
        setState({ status: 'done', result, error: null })
      }
    } catch (error) {
      if (current.signal.aborted || isAbort(error) || controller.current !== current) {
        return
      }
      setState({
        status: 'done',
        result: null,
        error: error instanceof RequestError ? error.message : 'The search failed. Try again.',
      })
    }
  }

  const setTerm = (value: string) => {
    cancel()
    const term = value.trim()
    if (term.length < minLength) {
      setState({ status: 'idle', result: null, error: null })
      return
    }
    setState((previous) => ({ ...previous, status: 'loading', error: null }))
    timer.current = setTimeout(() => {
      timer.current = null
      void run(term)
    }, debounceMs)
  }

  const reset = () => {
    cancel()
    setState({ status: 'idle', result: null, error: null })
  }

  return { ...state, setTerm, reset }
}
