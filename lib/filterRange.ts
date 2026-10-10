/** A range filter as the URL holds it: either end may be open (`null`). */
export type RangeBounds = { from: number | null; to: number | null }

export type Thumbs = [number, number]

const clamp = (value: number, floor: number, ceiling: number) =>
  Math.min(Math.max(value, floor), ceiling)

/**
 * Where a range slider's two thumbs rest for `bounds`: an open end sits at its end of the track, a
 * bound beyond the track is held at the end, and a reversed pair is put the right way round.
 */
export const toThumbs = ({ from, to }: RangeBounds, floor: number, ceiling: number): Thumbs => {
  const first = clamp(from ?? floor, floor, ceiling)
  const last = clamp(to ?? ceiling, floor, ceiling)
  return first <= last ? [first, last] : [last, first]
}

/**
 * The bounds for thumbs released at `thumbs`: a thumb resting at an end of the track is an open end.
 * A bound beyond the track (a hand-edited URL, a catalog wider than the slider) is kept while its
 * thumb has not left that end, so moving one thumb never drops the other side's bound.
 */
export const fromThumbs = (
  [first, last]: Thumbs,
  current: RangeBounds,
  floor: number,
  ceiling: number,
): RangeBounds => {
  const keepsLowerBound = current.from !== null && current.from < floor
  const keepsUpperBound = current.to !== null && current.to > ceiling
  return {
    from: first > floor ? first : keepsLowerBound ? current.from : null,
    to: last < ceiling ? last : keepsUpperBound ? current.to : null,
  }
}
