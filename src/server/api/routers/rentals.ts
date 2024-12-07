import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const rentalsRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.rental.findMany();
  }),

  create: publicProcedure
    .input(
      z.object({
        toolId: z.number(),
        startDate: z.string(),
        endDate: z.string(),
        startDateMessage: z.string(),
        endDateMessage: z.string(),
        quantity: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      if (!userId) {
        throw new Error("Unauthorized");
      }

      const tool = await ctx.db.tool.findUnique({
        where: {
          id: input.toolId,
        },
      });
      if (!tool) {
        throw new Error("Tool not found");
      }

      return ctx.db.rental.create({
        data: {
          status: "REQUESTED",
          userId: userId,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          startDateMessage: input.startDateMessage,
          endDateMessage: input.endDateMessage,
          ToolRental: {
            create: {
              toolId: input.toolId,
              quantity: input.quantity,
            },
          },
        },
      });
    }),
});
