import { PrismaClient } from "@prisma/client";

import { env } from "~/env";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      // env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

const globalForPrisma = global;

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
