/*
  Warnings:

  - You are about to drop the `Menu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuCategoryAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MenuCategoryAssignment" DROP CONSTRAINT "MenuCategoryAssignment_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "MenuCategoryAssignment" DROP CONSTRAINT "MenuCategoryAssignment_menuId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_categoryId_fkey";

-- DropTable
DROP TABLE "Menu";

-- DropTable
DROP TABLE "MenuCategory";

-- DropTable
DROP TABLE "MenuCategoryAssignment";

-- DropTable
DROP TABLE "MenuItem";
