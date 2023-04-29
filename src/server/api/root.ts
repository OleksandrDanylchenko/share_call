import { exampleRouter } from '@/server/api/routers/example';
import { notesRouter } from '@/server/api/routers/notes';
import { roomsRouter } from '@/server/api/routers/rooms';
import { userSettingsRouter } from '@/server/api/routers/user-settings';
import { createTRPCRouter } from '@/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  userSettings: userSettingsRouter,
  rooms: roomsRouter,
  notes: notesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
