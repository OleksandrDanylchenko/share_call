import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const roomsRouter = createTRPCRouter({
  getRooms: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.prisma.room.findMany({
      where: {
        OR: [
          { creator_id: userId },
          {
            sessions: {
              some: {
                participants: {
                  some: {
                    user_id: userId,
                  },
                },
              },
            },
          },
        ],
      },
      orderBy: { created_at: 'desc' },
    });
  }),
  createRoom: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name should be at least 1 character long'),
        description: z.string().optional(),
      }),
    )
    .mutation(({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const { name, description } = input;

      return ctx.prisma.room.create({
        data: {
          name,
          description,
          creator_id: userId,
        },
        select: { id: true },
      });
    }),
});
