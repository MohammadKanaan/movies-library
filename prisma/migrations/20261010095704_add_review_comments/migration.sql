-- CreateTable
CREATE TABLE "review_comments" (
    "id" UUID NOT NULL,
    "review_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "review_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "review_comments_review_id_created_at_id_idx" ON "review_comments"("review_id", "created_at", "id");

-- CreateIndex
CREATE INDEX "review_comments_author_id_idx" ON "review_comments"("author_id");

-- AddForeignKey
ALTER TABLE "review_comments" ADD CONSTRAINT "review_comments_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_comments" ADD CONSTRAINT "review_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE review_comments ADD CONSTRAINT review_comments_body_not_blank CHECK (btrim(body) <> '');
