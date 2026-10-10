import 'server-only'

/**
 * The first of `base`, `base-2`, `base-3`, … that is not in `taken`. The caller passes the slugs
 * that start with `base` (one indexed query); a race between two inserts still surfaces as a unique
 * violation, which the caller retries.
 */
export const uniqueSlug = (base: string, taken: readonly string[]): string => {
  const used = new Set(taken)
  if (!used.has(base)) {
    return base
  }
  for (let suffix = 2; ; suffix += 1) {
    const candidate = `${base}-${suffix}`
    if (!used.has(candidate)) {
      return candidate
    }
  }
}
