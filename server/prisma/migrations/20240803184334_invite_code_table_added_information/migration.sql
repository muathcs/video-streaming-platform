/*
  Warnings:

  - Made the column `code` on table `InviteCode` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "InviteCode" ALTER COLUMN "code" SET NOT NULL;
