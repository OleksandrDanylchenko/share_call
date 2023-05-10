/*
  Warnings:

  - You are about to drop the column `serialNumber` on the `note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "note" DROP COLUMN "serialNumber";

-- AlterTable
ALTER TABLE "room_sessions" ADD COLUMN     "serialNumber" SERIAL NOT NULL;
