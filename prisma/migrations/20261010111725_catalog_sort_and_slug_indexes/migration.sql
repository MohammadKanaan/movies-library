-- CreateIndex
CREATE INDEX "movies_created_at_id_idx" ON "movies"("created_at", "id");

-- CreateIndex
CREATE INDEX "movies_slug_pattern_idx" ON "movies"("slug" text_pattern_ops);

-- CreateIndex
CREATE INDEX "people_name_id_idx" ON "people"("name", "id");

-- CreateIndex
CREATE INDEX "people_slug_pattern_idx" ON "people"("slug" text_pattern_ops);
