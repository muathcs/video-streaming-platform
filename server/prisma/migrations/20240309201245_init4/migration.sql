/*
  Warnings:

  - You are about to drop the column `Data` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "Data",
ADD COLUMN     "Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
