import { z } from 'zod'

export const DEFAULT_PER_PAGE = 10
export const MAX_PER_PAGE = 100
/** Caps `page` so unauthenticated callers cannot mint unbounded cache keys and deep OFFSET scans. */
export const MAX_PAGE = 1000

export const sortDirectionSchema = z.enum(['asc', 'desc'])
export type SortDirection = z.infer<typeof sortDirectionSchema>

export const SEARCH_MIN_LENGTH = 3

/**
 * A free-text search term; empty means "no search". A term is at least three characters because
 * the trigram indexes (`gin_trgm_ops` on `movies.title` and `people.name`) cannot serve a shorter
 * `ILIKE`, which would scan the whole table.
 */
export const searchTermSchema = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `Search must be ${maxLength} characters or fewer`)
    .refine((value) => value.length === 0 || value.length >= SEARCH_MIN_LENGTH, {
      message: `Search needs at least ${SEARCH_MIN_LENGTH} characters`,
    })

/** `true` / `false` as a boolean or as the string a query string carries (never `z.coerce.boolean()`, which reads `'false'` as true). */
export const booleanParamSchema = z.union([z.boolean(), z.stringbool()])

export const pageQuerySchema = z.object({
  page: z.coerce.number().int().positive().max(MAX_PAGE).default(1),
  perPage: z.coerce.number().int().positive().max(MAX_PER_PAGE).default(DEFAULT_PER_PAGE),
})

export type PageQuery = z.infer<typeof pageQuerySchema>

/** What the viewer may do with a record; the DAL computes it per viewer and never caches it. */
export const permissionsSchema = z.object({
  update: z.boolean(),
  delete: z.boolean(),
})

export type Page<T> = {
  items: T[]
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}

export const pageSchema = <T extends z.ZodType>(item: T) => {
  return z.object({
    items: z.array(item),
    page: z.number().int(),
    perPage: z.number().int(),
    totalItems: z.number().int(),
    totalPages: z.number().int(),
  })
}

export const toPage = <T>(
  items: T[],
  totalItems: number,
  { page, perPage }: PageQuery,
): Page<T> => {
  return {
    items,
    page,
    perPage,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / perPage)),
  }
}
