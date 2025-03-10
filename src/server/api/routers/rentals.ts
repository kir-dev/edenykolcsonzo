import { Role } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

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
        status: z.enum(["REQUESTED", "ACCEPTED", "GIVEN_OUT", "BROUGHT_BACK"]),
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
      let userId: string | undefined = input?.userId;
      if (!userId) {
        if (!ctx.session?.user?.id) {
          throw new Error("User could not be determined");
        }
        userId = ctx.session.user.id;
      }
      return ctx.db.rental.findMany({
        where: {
          userId: userId,
        },
      });
    }),

  remove: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      if (ctx.session?.user.role !== Role.EK_MEMBER) {
        throw new Error("Unauthorized");
      }
      return ctx.db.$transaction([
        ctx.db.toolRental.deleteMany({
          where: { rentalId: input },
        }),
        ctx.db.rental.delete({
          where: { id: input },
        }),
      ]);
    }),

  changeQuantity: protectedProcedure
    .input(
      z.object({
        rentalId: z.number(),
        toolId: z.number(),
        quantity: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Ensure user is authorized.
      if (ctx.session?.user.role !== Role.EK_MEMBER) {
        throw new Error("Unauthorized");
      }

      // Negative quantities are not allowed.
      if (input.quantity < 0) {
        throw new Error("Quantity cannot be negative");
      }

      // When quantity is zero, delete the toolRental.
      if (input.quantity === 0) {
        await ctx.db.toolRental.delete({
          where: {
            rentalId_toolId: {
              rentalId: input.rentalId,
              toolId: input.toolId,
            },
          },
        });
        // If there are no more tool rentals for this rental, delete the rental.
        const remainingCount = await ctx.db.toolRental.count({
          where: { rentalId: input.rentalId },
        });
        if (remainingCount === 0) {
          return await ctx.db.rental.delete({
            where: { id: input.rentalId },
          });
        }
        return;
      }

      // Fetch the available quantity of the tool.
      const tool = await ctx.db.tool.findUnique({
        where: { id: input.toolId },
        select: { quantity: true },
      });
      if (!tool) {
        throw new Error("Tool not found");
      }
      if (input.quantity > tool.quantity) {
        throw new Error("Quantity cannot be more than available quantity");
      }

      // TODO: Check for available quantity in the time slot

      // Update the toolRental with the new quantity.
      return await ctx.db.toolRental.update({
        where: {
          rentalId_toolId: {
            rentalId: input.rentalId,
            toolId: input.toolId,
          },
        },
        data: {
          quantity: input.quantity,
        },
      });
    }),
});
