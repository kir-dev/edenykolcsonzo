import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const toolsRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.number().optional())
    .query(async ({ ctx, input }) => {
      if (input) {
        return ctx.db.tool.findUnique({
          where: {
            id: input,
          },
        });
      }
      return ctx.db.tool.findMany();
    }),

  getWithRentalInfo: publicProcedure
    .input(z.number().optional())
    .query(async ({ ctx, input }) => {
      if (input) {
        return ctx.db.tool.findUnique({
          where: {
            id: input,
          },
          include: {
            ToolRental: true,
          },
        });
      }
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
