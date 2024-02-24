-- AlterTable
ALTER TABLE "Celeb" ALTER COLUMN "imgurl" SET DATA TYPE VARCHAR(250);

UPDATE public."Celeb" SET document_with_idx = TO_TSVECTOR('simple', displayname);
