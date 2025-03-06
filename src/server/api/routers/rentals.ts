import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const rentalsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
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

  create: protectedProcedure
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
          userId: ctx.session!.user.id,
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

  updateStatus: protectedProcedure
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

  getUserRentals: protectedProcedure
    .input(z.object({ userId: z.string() }).optional())
    .query(async ({ ctx, input }) => {
      let userId: string | undefined = input?.userId
      if (!userId) {
        if (!ctx.session?.user?.id) {
          throw new Error("User could not be determined")
        }
        userId = ctx.session.user.id
      }
      return ctx.db.rental.findMany({
        where: {
          userId: userId
        }
      })
    }),
});
