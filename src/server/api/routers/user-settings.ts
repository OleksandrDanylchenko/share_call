import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const userSettingsRouter = createTRPCRouter({
  updateName: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string().min(1),
      }),
    )
    .mutation(({ input, ctx }) => {
      const { userId, name } = input;
      return ctx.prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }),
});
