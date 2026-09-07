import { z } from "zod";

import { isAdminRole } from "~/lib/utils";
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
        phoneNumber: true,
      },
    });
  }),

  // Update the current user's contact phone number
  updatePhoneNumber: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string().min(1).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.db.user.update({
        where: { id: userId },
        data: { phoneNumber: input.phoneNumber },
      });
    }),

  // Per-member summary of how many rentals each EK_MEMBER/ADMIN has given out
  // and taken back, for the circle-member overview page.
  getMemberStats: protectedProcedure.query(async ({ ctx }) => {
    if (!isAdminRole(ctx.session.user.role)) {
      throw new Error("Unauthorized");
    }

    const members = await ctx.db.user.findMany({
      where: { role: { in: ["EK_MEMBER", "ADMIN"] } },
      select: { id: true, fullName: true, nickname: true, email: true },
      orderBy: { fullName: "asc" },
    });

    const [givenOutCounts, returnedCounts] = await Promise.all([
      ctx.db.rental.groupBy({
        by: ["givenOutById"],
        where: { givenOutById: { not: null } },
        _count: { _all: true },
      }),
      ctx.db.rental.groupBy({
        by: ["returnedById"],
        where: { returnedById: { not: null } },
        _count: { _all: true },
      }),
    ]);

    const givenOutMap = new Map(
      givenOutCounts.map((row) => [row.givenOutById, row._count._all]),
    );
    const returnedMap = new Map(
      returnedCounts.map((row) => [row.returnedById, row._count._all]),
    );

    return members.map((member) => ({
      ...member,
      givenOutCount: givenOutMap.get(member.id) ?? 0,
      returnedCount: returnedMap.get(member.id) ?? 0,
    }));
  }),
});
