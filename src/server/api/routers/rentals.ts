import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const rentalsRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.rental.findMany({
      include: {
        user: true,
        ToolRental: {
          include: { tool: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
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

  updateStatus: publicProcedure
    .input(
      z.object({
        rentalId: z.number(),
        // Only allow the statuses defined in your enum:
        status: z.enum(["REQUESTED", "ACCEPTED", "EXPIRED", "BROUGHT_BACK"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Only EK_MEMBERs should be allowed
      if (ctx.session?.user.role !== "EK_MEMBER") {
        throw new Error("Unauthorized");
      }
      return ctx.db.rental.update({
        where: { id: input.rentalId },
        data: { status: input.status },
      });
    }),
    
});
