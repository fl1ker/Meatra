/*
  Warnings:

  - Added the required column `description` to the `JobPosition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobPosition" ADD COLUMN     "description" TEXT NOT NULL;
