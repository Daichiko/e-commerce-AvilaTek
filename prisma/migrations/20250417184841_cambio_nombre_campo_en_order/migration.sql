/*
  Warnings:

  - You are about to drop the column `estado` on the `Order` table. All the data in the column will be lost.
  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "estado",
ADD COLUMN     "status" TEXT NOT NULL;
