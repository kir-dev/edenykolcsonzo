import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const groupsRouter = createTRPCRouter({
  // The PÉK groups the current user is currently an active member of.
  getMine: protectedProcedure.query(async ({ ctx }) => {
    const memberships = await ctx.db.userGroup.findMany({
      where: { userId: ctx.session.user.id },
      include: { group: true },
      orderBy: { group: { name: "asc" } },
    });

    return memberships.map((membership) => membership.group);
  }),
});
