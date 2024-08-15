/*
  Warnings:

  - A unique constraint covering the columns `[inviteCodeId]` on the table `Celeb` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Celeb" ADD COLUMN     "inviteCodeId" TEXT;

-- CreateTable
CREATE TABLE "InviteCode" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(100),
    "is_used" BOOLEAN DEFAULT false,
    "celebId" TEXT,

    CONSTRAINT "InviteCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InviteCode_celebId_key" ON "InviteCode"("celebId");

-- CreateIndex
CREATE UNIQUE INDEX "Celeb_inviteCodeId_key" ON "Celeb"("inviteCodeId");

-- AddForeignKey
ALTER TABLE "Celeb" ADD CONSTRAINT "Celeb_inviteCodeId_fkey" FOREIGN KEY ("inviteCodeId") REFERENCES "InviteCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
