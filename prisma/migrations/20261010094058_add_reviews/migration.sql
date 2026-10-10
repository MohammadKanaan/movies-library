-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "movie_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "half_stars" SMALLINT NOT NULL,
    "body" TEXT,
    "spoiler" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reviews_movie_id_created_at_id_idx" ON "reviews"("movie_id", "created_at", "id");

-- CreateIndex
CREATE INDEX "reviews_author_id_idx" ON "reviews"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_movie_id_author_id_key" ON "reviews"("movie_id", "author_id");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE reviews ADD CONSTRAINT reviews_half_stars_range CHECK (half_stars BETWEEN 1 AND 10);

ALTER TABLE reviews ADD CONSTRAINT reviews_spoiler_needs_body CHECK (NOT spoiler OR body IS NOT NULL);
