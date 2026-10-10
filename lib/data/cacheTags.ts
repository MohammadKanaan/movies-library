import 'server-only'

/** Cache tags for `remember()` / `invalidateTags()`. Writes invalidate them inside the DAL. */
export const userTag = (id: string) => `user:${id}`
