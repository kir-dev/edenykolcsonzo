import { z } from "zod";

import { isAdminRole } from "~/lib/utils";

import { protectedProcedure } from "../trpc";

// Admin/EK_MEMBER-only rental moderation procedures, split out of rentals.ts to keep
// that file focused on the renter-facing CRUD flow.
export const rentalsAdminProcedures = {
  remove: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      if (!isAdminRole(ctx.session?.user.role)) {
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
      if (!isAdminRole(ctx.session?.user.role)) {
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
};
