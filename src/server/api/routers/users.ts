import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  // Get all EK_MEMBER users for the members display
  getEKMembers: publicProcedure.query(async ({ ctx }) => {
    const members = await ctx.db.user.findMany({
      where: {
        role: "EK_MEMBER",
      },
      select: {
        id: true,
        fullName: true,
        nickname: true,
        profileImage: true,
        email: true,
      },
      orderBy: {
        fullName: "asc",
      },
    });

    return members;
  }),

  // Update the current user's profile image
  updateProfileImage: protectedProcedure
    .input(
      z.object({
        profileImage: z.string().url().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.db.user.update({
        where: { id: userId },
        data: { profileImage: input.profileImage },
      });
    }),

  // Get current user's profile data
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return ctx.db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        nickname: true,
        profileImage: true,
        email: true,
        role: true,
      },
    });
  }),
});
