import { z } from 'zod';

import { prisma } from '@/server/db';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const notesRouter = createTRPCRouter({
  getRoomNotes: protectedProcedure
    .input(
      z.object({
        roomId: z
          .string()
          .cuid()
          .refine(
            async (id) => (await prisma.room.count({ where: { id } })) !== 0,
            'The room for the provided id does not exist',
          ),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { roomId } = input;
      return ctx.prisma.note.findMany({
        where: { roomId },
        include: {
          room: {
            select: {
              id: true,
              name: true,
            },
          },
          roomSession: {
            select: {
              id: true,
              startedAt: true,
              finishedAt: true,
            },
          },
        },
      });
    }),
});
