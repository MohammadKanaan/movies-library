-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "rating_average" DOUBLE PRECISION,
ADD COLUMN     "rating_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rating_total" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "movies_rating_average_idx" ON "movies"("rating_average");

-- A movie's rating columns are the aggregate of its reviews. Every change is applied as a delta in
-- one UPDATE of the movie row: concurrent reviews of one movie queue on its row lock, and each sees
-- the totals the previous one left, so no rating is lost. The SET expressions read the row as it was
-- before the UPDATE, hence the deltas repeated in the average. A movie being deleted is already gone
-- when its reviews cascade, so their UPDATE matches no row.
CREATE FUNCTION movies_apply_rating(movie UUID, count_delta INTEGER, total_delta INTEGER)
RETURNS void
LANGUAGE sql
AS $$
  UPDATE movies SET
    rating_count = rating_count + count_delta,
    rating_total = rating_total + total_delta,
    rating_average = round(
      (rating_total + total_delta)::numeric / NULLIF(rating_count + count_delta, 0) / 2,
      1
    )
  WHERE id = movie
$$;

CREATE FUNCTION reviews_sync_movie_rating()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    PERFORM movies_apply_rating(OLD.movie_id, -1, -OLD.half_stars);
  END IF;
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    PERFORM movies_apply_rating(NEW.movie_id, 1, NEW.half_stars);
  END IF;
  RETURN NULL;
END
$$;

-- Created before the backfill: it locks out review writes until this migration commits, so none
-- can land between the backfill's snapshot and the trigger.
CREATE TRIGGER reviews_sync_movie_rating
AFTER INSERT OR DELETE OR UPDATE OF movie_id, half_stars ON reviews
FOR EACH ROW EXECUTE FUNCTION reviews_sync_movie_rating();

UPDATE movies SET
  rating_count = totals.count,
  rating_total = totals.total,
  rating_average = round(totals.total::numeric / totals.count / 2, 1)
FROM (
  SELECT movie_id, count(*)::integer AS count, sum(half_stars)::integer AS total
  FROM reviews
  GROUP BY movie_id
) AS totals
WHERE movies.id = totals.movie_id;
