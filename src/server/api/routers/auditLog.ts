import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const auditLogRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.role !== "ADMIN") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return ctx.db.auditLog.findMany({
      include: { actor: true },
      orderBy: { createdAt: "desc" },
      take: 500,
    });
  }),
});
