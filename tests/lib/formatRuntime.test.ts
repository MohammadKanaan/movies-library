import { describe, expect, it } from 'vitest'
import { formatRuntime } from '@/lib/formatRuntime'

describe('formatRuntime', () => {
  it('writes hours and minutes, dropping a zero part', () => {
    expect(formatRuntime(166)).toBe('2h 46m')
    expect(formatRuntime(120)).toBe('2h')
    expect(formatRuntime(45)).toBe('45m')
    expect(formatRuntime(1)).toBe('1m')
  })
})
