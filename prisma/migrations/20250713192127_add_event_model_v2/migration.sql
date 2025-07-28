/*
  Warnings:

  - You are about to drop the column `photoPath` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "photoPath",
ADD COLUMN     "image" TEXT;
