/*
  Warnings:

  - Added the required column `completed_onboarding` to the `Celeb` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Celeb" ADD COLUMN "completed_onboarding" BOOLEAN NOT NULL DEFAULT false;
