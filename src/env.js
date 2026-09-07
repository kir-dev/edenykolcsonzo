import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    AUTHSCH_CLIENT_ID: z.string(),
    AUTHSCH_CLIENT_SECRET: z.string(),
    KIR_MAIL_API_URL: z.string().url().default("https://mail.kir-dev.hu/api"),
    KIR_MAIL_API_KEY: z.string().optional(),
    KIR_MAIL_FROM_EMAIL: z.string().default("noreply@kir-dev.hu"),
    KIR_MAIL_FROM_NAME: z.string().default("Edénykölcsönző"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTHSCH_CLIENT_ID: process.env.AUTHSCH_CLIENT_ID,
    AUTHSCH_CLIENT_SECRET: process.env.AUTHSCH_CLIENT_SECRET,
    KIR_MAIL_API_URL: process.env.KIR_MAIL_API_URL,
    KIR_MAIL_API_KEY: process.env.KIR_MAIL_API_KEY,
    KIR_MAIL_FROM_EMAIL: process.env.KIR_MAIL_FROM_EMAIL,
    KIR_MAIL_FROM_NAME: process.env.KIR_MAIL_FROM_NAME,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
