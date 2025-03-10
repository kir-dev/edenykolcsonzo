import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const pageContentRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.enum(["ABOUT"]))
    .query(async ({ ctx, input }) => {
      return ctx.db.pagesContent.findUnique({
        where: {
          pageType: input,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        pageType: z.enum(["ABOUT"]),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.pagesContent.update({
        where: {
          pageType: input.pageType,
        },
        data: {
          content: input.content,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        pageType: z.enum(["ABOUT"]),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.pagesContent.create({
        data: {
          pageType: input.pageType,
          content: input.content,
        },
      });
    }),
});
