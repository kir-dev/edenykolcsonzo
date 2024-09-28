import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const toolsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.tool.findMany();
  }),

  getOne: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return ctx.db.tool.findUnique({
      where: {
        id: input,
      },
    });
  }),

  getAllWithRentalInfo: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.tool.findMany({
      include: {
        ToolRental: true,
      },
    });
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
