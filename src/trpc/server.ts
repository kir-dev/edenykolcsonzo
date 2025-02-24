import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";

import { type AppRouter, createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  // Since the object returned from calling headers() cannot be modified,
  // we need to create a new Headers object and copy the values from the original one.
  const heads = await headers();
  const newHeaders = new Headers();

  heads.forEach((value, key) => {
    newHeaders.append(key, value);
  });
  newHeaders.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: newHeaders,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
