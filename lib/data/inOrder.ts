import 'server-only'

/**
 * Keeps `items` in the order of `ids` (`WHERE id IN (...)` returns rows in no particular order),
 * dropping an id with no item. For ids ranked in SQL and then read with a list's select.
 */
export const inOrder = <T extends { id: string }>(ids: string[], items: T[]): T[] => {
  const byId = new Map(items.map((item) => [item.id, item]))
  return ids.flatMap((id) => {
    const item = byId.get(id)
    return item ? [item] : []
  })
}
