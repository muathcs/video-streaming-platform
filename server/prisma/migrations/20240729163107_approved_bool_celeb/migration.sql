/*
  Warnings:

  - You are about to drop the column `processed` on the `Request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Celeb" ADD COLUMN     "Approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "processed";
