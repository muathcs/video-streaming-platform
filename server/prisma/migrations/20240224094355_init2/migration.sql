/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `Celeb` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Celeb_uid_key" ON "Celeb"("uid");
