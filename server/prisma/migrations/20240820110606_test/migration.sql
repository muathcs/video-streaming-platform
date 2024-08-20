/*
  Warnings:

  - Added the required column `requestId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "requestId" VARCHAR(50) NOT NULL;
