import { circleMemberProcedure, createTRPCRouter } from "~/server/api/trpc";

export const circleMemberRouter = createTRPCRouter({
  /**
   * Retrieves every information needed by the circle members for the admin page.
   * This includes the list of tools and the list of rentals.
   */
  getAdminDashboardData: circleMemberProcedure.query(async ({ ctx }) => {
    const tools = await ctx.db.tool.findMany({
      include: {
        rentals: true,
      },
    });

    const rentals = await ctx.db.rental.findMany({
      include: {
        user: true,
      },
    });

    return {
      tools,
      rentals,
    };
  }),
});
