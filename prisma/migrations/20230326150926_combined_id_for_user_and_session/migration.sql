/*
  Warnings:

  - The primary key for the `session_participants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `session_participants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "session_participants" DROP CONSTRAINT "session_participants_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "session_participants_pkey" PRIMARY KEY ("user_id", "session_id");
