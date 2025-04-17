/*
  Warnings:

  - Added the required column `sellerId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "sellerId" TEXT NOT NULL;

-- RenameForeignKey
ALTER TABLE "Order" RENAME CONSTRAINT "Order_userId_fkey" TO "fk_orden_user";
