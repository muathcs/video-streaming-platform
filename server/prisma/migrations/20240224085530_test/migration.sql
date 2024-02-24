/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `Fan` will be added. If there are existing duplicate values, this will fail.
  - Made the column `uid` on table `Fan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Fan" ALTER COLUMN "uid" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Fan_uid_key" ON "Fan"("uid");
