-- DropForeignKey
ALTER TABLE "room_sessions" DROP CONSTRAINT "room_sessions_room_id_fkey";

-- DropForeignKey
ALTER TABLE "session_participants" DROP CONSTRAINT "session_participants_session_id_fkey";

-- AddForeignKey
ALTER TABLE "room_sessions" ADD CONSTRAINT "room_sessions_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_participants" ADD CONSTRAINT "session_participants_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "room_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
