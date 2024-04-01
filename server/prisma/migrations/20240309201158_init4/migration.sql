/*
  Warnings:

  - Added the required column `event` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewer_name` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "Data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "event" VARCHAR(20) NOT NULL,
ADD COLUMN     "reviewer_name" VARCHAR(40) NOT NULL,
ALTER COLUMN "message" SET DATA TYPE VARCHAR(350);
