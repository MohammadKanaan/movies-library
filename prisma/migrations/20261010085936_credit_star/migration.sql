-- AlterTable
ALTER TABLE "credits" ADD COLUMN     "star" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE credits ADD CONSTRAINT credits_star_cast_only CHECK (NOT star OR role = 'ACTOR');

-- Until now the movie page billed the first three cast members as its stars; keep them starred.
UPDATE credits SET star = true WHERE role = 'ACTOR' AND position < 3;
