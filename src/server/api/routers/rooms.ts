import { pickBy } from 'lodash';
import { z } from 'zod';

import { shortNanoid } from '@/server/api/services/random';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const roomsRouter = createTRPCRouter({
  getRooms: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.prisma.room.findMany({
      where: {
        OR: [
          { creator_id: userId },
          {
            sessions: { some: { participants: { some: { user_id: userId } } } },
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
          invite_code: shortNanoid(),
        },
        select: { id: true },
      });
    }),
  updateRoom: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(({ input, ctx }) => {
      const { id, ...payload } = input;
      const updatePayload = pickBy(payload);

      return ctx.prisma.room.update({
        where: { id },
        data: updatePayload,
        select: { id: true, name: true, description: true },
      });
    }),
});
