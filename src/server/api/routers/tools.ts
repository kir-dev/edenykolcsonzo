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
