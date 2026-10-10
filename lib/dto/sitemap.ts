import { z } from 'zod'

/** One catalog page as the sitemap lists it: when its record last changed, and its image if any. */
export const sitemapEntrySchema = z.object({
  slug: z.string(),
  updatedAt: z.coerce.date(),
  /** The movie's poster or the person's headshot. */
  imageUrl: z.string().nullable(),
})

export type SitemapEntry = z.infer<typeof sitemapEntrySchema>

/** Every movie page and every person page, for `app/sitemap.ts`. */
export const sitemapCatalogSchema = z.object({
  movies: z.array(sitemapEntrySchema),
  people: z.array(sitemapEntrySchema),
})

export type SitemapCatalog = z.infer<typeof sitemapCatalogSchema>
