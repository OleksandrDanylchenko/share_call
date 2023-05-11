import { isUndefined, last, omitBy } from 'lodash';
import { z } from 'zod';

import { shortNanoid } from '@/server/api/services/random';
import { prisma } from '@/server/db';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const roomsRouter = createTRPCRouter({
  getRooms: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.prisma.room.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { sessions: { some: { participants: { some: { userId } } } } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }),
  getRoom: protectedProcedure
    .input(
      z.object({
        id: z
          .string()
          .cuid()
          .refine(
            async (id) => (await prisma.room.count({ where: { id } })) !== 0,
            'The room for the provided id does not exist',
          ),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id: roomId } = input;

      const room = await ctx.prisma.room.findUnique({
        where: { id: roomId },
        include: {
          sessions: {
            orderBy: { startedAt: 'desc' },
            take: 1,
            select: {
              id: true,
              startedAt: true,
              finishedAt: true,
              participants: {
                where: { active: true },
                select: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      image: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  notes: true,
                },
              },
            },
          },
        },
      });
      if (!room) return room;

      const { sessions, ...roomProps } = room;
      return {
        ...roomProps,
        lastSession: last(sessions),
      };
    }),
  getRoomSessions: protectedProcedure
    .input(
      z.object({
        id: z
          .string()
          .cuid()
          .refine(
            async (id) => (await prisma.room.count({ where: { id } })) !== 0,
            'The room for the provided id does not exist',
          ),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id: roomId } = input;
      return ctx.prisma.roomSession.findMany({
        where: { roomId },
        orderBy: { startedAt: 'desc' },
        select: {
          id: true,
          startedAt: true,
          finishedAt: true,
          serialNumber: true,
          participants: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          _count: {
            select: {
              notes: true,
            },
          },
        },
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
          creatorId: userId,
          inviteCode: shortNanoid(),
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
      const updatePayload = omitBy(payload, isUndefined);

      return ctx.prisma.room.update({
        where: { id },
        data: updatePayload,
        select: { id: true, name: true, description: true },
      });
    }),
  deleteRoom: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      const { id: roomId } = input;
      const userId = ctx.session.user.id;

      const room = await ctx.prisma.room.findUnique({
        where: { id: roomId },
      });
      if (room?.creatorId !== userId) {
        throw new Error('You are not the creator of this room');
      }

      await ctx.prisma.room.delete({ where: { id: roomId } });
    }),
  getRoomByInviteCode: protectedProcedure
    .input(
      z.object({
        inviteCode: z
          .string()
          .min(1, 'Invite code should be at least 1 character long')
          .refine(
            async (inviteCode) =>
              (await prisma.room.count({ where: { inviteCode } })) !== 0,
            'The room for the provided invite code does not exist',
          ),
      }),
    )
    .query(({ input, ctx }) => {
      const { inviteCode } = input;
      return ctx.prisma.room.findUnique({
        where: { inviteCode },
        select: { id: true },
      });
    }),
  connectParticipant: protectedProcedure
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
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const { roomId } = input;

      let activeSession = await ctx.prisma.roomSession.findFirst({
        where: { roomId, finishedAt: null },
        orderBy: { startedAt: 'desc' },
        select: { id: true },
      });
      if (!activeSession) {
        const penultimateSession = await ctx.prisma.roomSession.findFirst({
          where: { roomId },
          orderBy: { startedAt: 'desc' },
          select: { id: true, serialNumber: true },
        });
        activeSession = await ctx.prisma.roomSession.create({
          data: {
            roomId,
            serialNumber: (penultimateSession?.serialNumber || 0) + 1,
          },
          select: { id: true },
        });
      }

      await ctx.prisma.sessionParticipant.upsert({
        where: { userId_sessionId: { userId, sessionId: activeSession.id } },
        update: { active: true },
        create: {
          userId,
          sessionId: activeSession.id,
          active: true,
          role: 'viewer',
        },
      });

      return {
        roomId,
        sessionId: activeSession.id,
      };
    }),
  disconnectParticipant: protectedProcedure
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
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const { roomId } = input;

      const activeSession = await ctx.prisma.roomSession.findFirst({
        where: { roomId, finishedAt: null },
        orderBy: { startedAt: 'desc' },
        select: { id: true },
      });
      if (!activeSession) {
        throw new Error('No active session found!');
      }

      await ctx.prisma.sessionParticipant.update({
        where: { userId_sessionId: { userId, sessionId: activeSession.id } },
        data: { active: false },
      });

      // Finish the empty session
      await ctx.prisma.roomSession.updateMany({
        where: {
          roomId,
          finishedAt: null,
          participants: {
            every: { active: false },
          },
        },
        data: { finishedAt: new Date() },
      });

      return { roomId };
    }),
});
