import { z } from 'zod';

import { prisma } from '@/server/db';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const userSettingsRouter = createTRPCRouter({
  updateName: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name should be at least 1 character long'),
      }),
    )
    .mutation(({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const { name } = input;

      return ctx.prisma.user.update({ where: { id: userId }, data: { name } });
    }),
  updateEmail: protectedProcedure
    .input(
      z.object({
        email: z
          .string()
          .email('Email should be a valid email address')
          .refine(
            async (email) =>
              (await prisma.user.count({ where: { email } })) === 0,
            'Email has already been occupied',
          ),
      }),
    )
    .mutation(({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const { email } = input;

      return ctx.prisma.user.update({
        where: { id: userId },
        data: { email },
      });
    }),
  updateImage: protectedProcedure
    .input(z.object({ image: z.string().url() }))
    .mutation(({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const { image } = input;

      return ctx.prisma.user.update({ where: { id: userId }, data: { image } });
    }),
});
