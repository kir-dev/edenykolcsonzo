import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const toolsRouter = createTRPCRouter({
  get: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return ctx.db.tool.findUnique({
      where: {
        id: input,
      },
    });
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return (await ctx.db.tool.findMany()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }),

  getWithRentalInfo: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.tool.findUnique({
        where: {
          id: input,
        },
        include: {
          rentals: true,
        },
      });
    }),

  upsertTool: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string().min(1),
        quantity: z.number().min(1),
        description: z.string().optional(),
        rentable: z.boolean().optional(),
        image: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.id === undefined) {
        return ctx.db.tool.create({
          data: {
            name: input.name,
            quantity: input.quantity,
            description: input.description ?? "",
            rentable: input.rentable ?? true,
            image: input.image,
          },
        });
      }
      return ctx.db.tool.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          quantity: input.quantity,
          description: input.description,
          rentable: input.rentable,
          image: input.image,
        },
      });
    }),

  deleteTool: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tool.delete({
        where: { id: input },
      });
    }),

  getAllWithRentalInfo: publicProcedure.query(async ({ ctx }) => {
    const tools = await ctx.db.tool.findMany({
      include: {
        rentals: true,
      },
    });

    return tools;
  }),

  getAvailableInPeriod: publicProcedure
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const start = new Date(input.startDate);
      const end = new Date(input.endDate);

      // Get all rentable tools with their rentals that overlap the given period
      const tools = await ctx.db.tool.findMany({
        where: { rentable: true },
        include: {
          rentals: {
            include: {
              rental: true,
            },
            where: {
              rental: {
                // Overlapping date check: rental overlaps if:
                // rental.startDate < input.endDate AND rental.endDate > input.startDate
                startDate: { lt: end },
                endDate: { gt: start },
                // Only count active rentals (not returned)
                status: { notIn: ["BROUGHT_BACK"] },
              },
            },
          },
        },
      });

      // Calculate available quantity for each tool
      return tools
        .map((tool) => {
          const rentedQuantity = tool.rentals.reduce(
            (sum, tr) => sum + tr.quantity,
            0,
          );
          return {
            ...tool,
            availableQuantity: tool.quantity - rentedQuantity,
          };
        })
        .filter((tool) => tool.availableQuantity > 0)
        .sort((a, b) => a.name.localeCompare(b.name));
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        quantity: z.number().min(1),
        description: z.string().optional(),
        rentable: z.boolean().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tool.create({
        data: {
          name: input.name,
          quantity: input.quantity,
          description: input.description ?? "",
          rentable: input.rentable ?? true,
          image: input.image,
        },
      });
    }),
});
