import { isUndefined, last, omitBy } from 'lodash';
import { z } from 'zod';

import { prisma } from '@/server/db';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const notesRouter = createTRPCRouter({
  getGroupedRoomNotes: protectedProcedure
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
      const notes = await ctx.prisma.note.findMany({
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
        orderBy: { createdAt: 'desc' },
      });

      return notes.reduce<
        Array<{ sessionId: string | null; notes: typeof notes }>
      >((grouped, note) => {
        const { roomSessionId } = note;
        if (roomSessionId) {
          const sessionGroup = grouped.find(
            (group) => group.sessionId === roomSessionId,
          );
          if (sessionGroup) {
            sessionGroup.notes.push(note); // Mutation will do its thing
            return grouped;
          }
          return [...grouped, { sessionId: roomSessionId, notes: [note] }];
        }

        const lastGroup = last(grouped);
        if (!lastGroup || lastGroup.sessionId) {
          return [...grouped, { sessionId: null, notes: [note] }];
        }
        lastGroup.notes.push(note); // Mutation will do its thing
        return grouped;
      }, []);
    }),
  getNote: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;
      return ctx.prisma.note.findUnique({ where: { id } });
    }),
  createNote: protectedProcedure
    .input(
      z.object({
        content: z
          .string()
          .min(1, 'Content should be at least 1 character long'),
        roomId: z.string().cuid(),
        roomSessionId: z.string().cuid().optional(),
      }),
    )
    .mutation(({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const { content, roomId, roomSessionId } = input;

      return ctx.prisma.note.create({
        data: {
          content,
          roomId,
          roomSessionId,
          creatorId: userId,
        },
        select: { id: true },
      });
    }),
  updateNote: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        content: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      const { id, ...payload } = input;
      const updatePayload = omitBy(payload, isUndefined);

      return ctx.prisma.note.update({
        where: { id },
        data: updatePayload,
        select: { id: true, content: true },
      });
    }),
  deleteRoom: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      const { id: noteId } = input;
      const userId = ctx.session.user.id;

      const note = await ctx.prisma.note.findUnique({
        where: { id: noteId },
      });
      if (note?.creatorId !== userId) {
        throw new Error('You are not the creator of this room');
      }

      await ctx.prisma.room.delete({ where: { id: noteId } });
    }),
});
