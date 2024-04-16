/*
  Warnings:

  - The `fav_categories` column on the `Fan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Fan" DROP COLUMN "fav_categories",
ADD COLUMN     "fav_categories" INTEGER;
