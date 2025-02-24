import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";

import AuthSCHProvider, {
  type AuthSCHProfile,
} from "next-auth-authsch-provider";

import { env } from "~/env";
import { db } from "~/server/db";
import { type Role } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: Role;
    } & DefaultSession["user"];
  }
  interface User {
    fullName: string;
    role: Role;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        name: user.fullName,
        role: user.role,
      },
    }),
  },
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: "database" },
  providers: [
    AuthSCHProvider({
      clientId: env.AUTHSCH_CLIENT_ID,
      clientSecret: env.AUTHSCH_CLIENT_SECRET,
      scope: "basic mail sn givenName displayName eduPersonEntitlement",
      async profile(profile: AuthSCHProfile) {
        const ekPekID = process.env.NODE_ENV == "production" ? 40 : 106;
        const role = profile.eduPersonEntitlement.find(
          (group) => group.id === ekPekID && group.end === null,
        )
          ? "EK_MEMBER"
          : "USER";
        // Update the user's role in the database based on the group membership.
        // The internal_id doesn't have a unique constraint, so we can't use a normal update here.
        // But we can't really have two users with the same internal_id, so this should be fine.
        await db.user
          .updateMany({
            where: {
              accounts: { some: { providerAccountId: profile.internal_id } },
            },
            data: { role: role },
          })
          .catch(console.error);
        // First time login, create a new user in the database. Handled by Auth.js.
        return {
          id: profile.internal_id,
          fullName: profile.displayName,
          email: profile.mail,
          role: role,
        };
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
