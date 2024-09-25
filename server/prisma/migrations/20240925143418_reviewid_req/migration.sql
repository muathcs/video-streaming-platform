/*
  Warnings:

  - A unique constraint covering the columns `[requestId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "isReviewed" DROP NOT NULL,
ALTER COLUMN "isReviewed" DROP DEFAULT,
ALTER COLUMN "isReviewed" SET DATA TYPE VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "Review_requestId_key" ON "Review"("requestId");
