/*
  Warnings:

  - You are about to drop the column `user_id` on the `room_sessions` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "session_role" AS ENUM ('admin', 'viewer');

-- DropForeignKey
ALTER TABLE "room_sessions" DROP CONSTRAINT "room_sessions_user_id_fkey";

-- AlterTable
ALTER TABLE "room_sessions" DROP COLUMN "user_id";

-- CreateTable
CREATE TABLE "session_participants" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "role" "session_role" NOT NULL,

    CONSTRAINT "session_participants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "session_participants" ADD CONSTRAINT "session_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_participants" ADD CONSTRAINT "session_participants_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "room_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
