import { type PrismaClient, type RentalStatus } from "@prisma/client";

import { sendMail } from "~/server/mail/client";
import {
  type RentalEmailInput,
  rentalStatusChangedEmail,
  type RentalStatusChangeInput,
} from "~/server/mail/rentalEmails";

// Maps a target rental status to the Rental field that should record who made
// the transition happen. REQUESTED has no such field - it's set on creation.
export const STATUS_ACTOR_FIELD: Partial<
  Record<RentalStatus, "acceptedById" | "givenOutById" | "returnedById">
> = {
  ACCEPTED: "acceptedById",
  GIVEN_OUT: "givenOutById",
  BROUGHT_BACK: "returnedById",
};

// Verifies the group exists and the user is currently an active member of it, throwing
// otherwise. A rental must not be attachable to an arbitrary/foreign group.
export async function assertGroupMembership(
  db: PrismaClient,
  userId: string,
  groupId: number | undefined,
) {
  if (groupId === undefined) {
    return;
  }
  const membership = await db.userGroup.findUnique({
    where: { userId_groupId: { userId, groupId } },
  });
  if (!membership) {
    throw new Error("You are not a member of this group");
  }
}

// Fires the "your rental request was created" email. Fire-and-forget: mail failures
// must never fail the mutation that created the rental.
//
// DISABLED for now - only the ACCEPTED status-change email should send (see
// notifyStatusChanged below and its callers in rentals.ts). Remove this early
// return to turn it back on.
export function notifyRentalCreated(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userEmail: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: RentalEmailInput,
) {
  return;
}

// Fires the "your rental's status changed" email. Callers are expected to only call
// this for statuses that currently have a notification (see rentals.ts).
export function notifyStatusChanged(
  userEmail: string | null | undefined,
  status: RentalStatus,
  input: RentalStatusChangeInput,
) {
  if (!userEmail) return;
  // eslint-disable-next-line no-void
  void rentalStatusChangedEmail(status, input).then(({ subject, html }) =>
    sendMail({ to: userEmail, subject, html }),
  );
}
