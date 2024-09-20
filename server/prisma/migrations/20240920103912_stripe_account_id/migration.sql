/*
  Warnings:

  - Added the required column `stripe_account_id` to the `Celeb` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Celeb" ADD COLUMN     "stripe_account_id" VARCHAR(30) NOT NULL;
