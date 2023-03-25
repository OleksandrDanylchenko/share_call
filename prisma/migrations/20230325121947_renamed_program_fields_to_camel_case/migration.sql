/*
  Warnings:

  - A unique constraint covering the columns `[invite_code]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invite_code` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "invite_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "session_participants" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "rooms_invite_code_key" ON "rooms"("invite_code");
