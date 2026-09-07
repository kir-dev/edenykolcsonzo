import { PrismaAdapter } from "@auth/prisma-adapter";
import { type Role } from "@prisma/client";
import {
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import AuthSCHProvider, {
  type AuthSCHProfile,
} from "next-auth-authsch-provider";

import { env } from "~/env";
import { db } from "~/server/db";

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
// next-auth's `events.signIn` callback (which fires once the adapter has created/loaded
// the user row, so it's safe to use `user.id` as a foreign key) is only ever given the
// *transformed* profile - i.e. whatever our provider's `profile()` below returns
// (`{ id, fullName, email, role }`), not the raw AuthSCH profile with
// `eduPersonEntitlement`. And we can't just stuff the raw entitlements onto that
// transformed object either: the Prisma adapter passes it straight into
// `db.user.create()` for new users, so any extra field blows that up.
// `callbacks.signIn`, on the other hand, *is* given the raw profile - but it runs
// before the user row exists, so writing the group membership there would violate the
// FK constraint for first-time logins.
// So we stash the raw entitlements here in `callbacks.signIn` and consume them in
// `events.signIn` once the user id is guaranteed to exist. Both fire within the same
// request, keyed by account so concurrent logins can't cross-contaminate.
const pendingGroupSyncByAccount = new Map<
  string,
  AuthSCHProfile["eduPersonEntitlement"]
>();

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
    signIn({ account, profile }) {
      const entitlements = (profile as AuthSCHProfile | undefined)
        ?.eduPersonEntitlement;
      if (entitlements && account) {
        pendingGroupSyncByAccount.set(
          `${account.provider}:${account.providerAccountId}`,
          entitlements,
        );
      }
      return true;
    },
  },
  events: {
    // Keep the user's PÉK group memberships (from eduPersonEntitlement) in sync on every
    // login.
    async signIn({ user, account }) {
      if (!account || !user.id) return;
      const key = `${account.provider}:${account.providerAccountId}`;
      const entitlements = pendingGroupSyncByAccount.get(key);
      pendingGroupSyncByAccount.delete(key);
      if (!entitlements) return;

      const activeGroups = entitlements.filter((group) => group.end === null);

      await db.$transaction([
        ...activeGroups.map((group) =>
          db.group.upsert({
            where: { id: group.id },
            create: { id: group.id, name: group.name },
            update: { name: group.name },
          }),
        ),
        ...activeGroups.map((group) =>
          db.userGroup.upsert({
            where: { userId_groupId: { userId: user.id, groupId: group.id } },
            create: { userId: user.id, groupId: group.id },
            update: {},
          }),
        ),
        db.userGroup.deleteMany({
          where: {
            userId: user.id,
            groupId: { notIn: activeGroups.map((group) => group.id) },
          },
        }),
      ]);
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: "database" },
  providers: [
    AuthSCHProvider({
      clientId: env.AUTHSCH_CLIENT_ID,
      clientSecret: env.AUTHSCH_CLIENT_SECRET,
      scope: "basic mail sn givenName displayName eduPersonEntitlement",
      async profile(profile: AuthSCHProfile) {
        const ekPekID = process.env.NODE_ENV === "production" ? 40 : 106;
        const role = profile.eduPersonEntitlement.find(
          (group) => group.id === ekPekID && group.end === null,
        )
          ? "EK_MEMBER"
          : "USER";
        // Update the user's role in the database based on the group membership.
        // The internal_id doesn't have a unique constraint, so we can't use a normal update here.
        // But we can't really have two users with the same internal_id, so this should be fine.
        // ADMIN is granted manually (not derived from the SSO group), so it's excluded here
        // to make sure this sync never demotes an admin back to USER/EK_MEMBER on login.
        await db.user
          .updateMany({
            where: {
              accounts: { some: { providerAccountId: profile.internal_id } },
              role: { not: "ADMIN" },
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
