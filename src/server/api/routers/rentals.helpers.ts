import {
  type Prisma,
  type PrismaClient,
  type RentalStatus,
  type Role,
} from "@prisma/client";

import {
  canSetAnyStatus,
  nextStatus,
  rentalLabel,
  statusTitle,
} from "~/lib/utils";
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

// Throws unless the user may move the rental into the given status: admins and the EK
// group leader may pick any status, everyone else only the next step. Returns the
// rental's current status, so the update can be made conditional on it.
export async function assertCanMoveToStatus(
  db: PrismaClient,
  user: { role: Role; ekLeader: boolean },
  rentalId: number,
  status: RentalStatus,
) {
  const rental = await db.rental.findUnique({
    where: { id: rentalId },
    select: { status: true },
  });
  if (!rental) {
    throw new Error("Rental not found");
  }
  if (!canSetAnyStatus(user) && nextStatus(rental.status) !== status) {
    throw new Error("Unauthorized");
  }
  return rental.status;
}

// Moves the rental into the new status, records who did it (see STATUS_ACTOR_FIELD)
// and writes the audit log entry. The update also matches the status the permission
// check saw, so two members clicking at once can't both advance the same rental.
export async function applyStatusChange(
  db: PrismaClient,
  rentalId: number,
  fromStatus: RentalStatus,
  toStatus: RentalStatus,
  actorId: string,
) {
  const actorField = STATUS_ACTOR_FIELD[toStatus];

  return db.$transaction(async (tx) => {
    const rental = await tx.rental.update({
      where: { id: rentalId, status: fromStatus },
      data: {
        status: toStatus,
        ...(actorField ? { [actorField]: actorId } : {}),
      },
      include: {
        user: true,
        acceptedBy: true,
        ToolRental: { include: { tool: true } },
      },
    });
    await tx.auditLog.create({
      data: {
        action: "RENTAL_STATUS_CHANGE",
        entityType: "Rental",
        entityId: String(rentalId),
        actorId,
        message: `${rentalLabel(rental)} kérés státusza "${statusTitle(toStatus)}" lett`,
      },
    });
    return rental;
  });
}

// Writes the "request created" audit log entry. Meant to run in the same transaction
// as the rental's creation, so a request never exists without its log entry.
export function logRentalCreated(
  tx: Prisma.TransactionClient,
  rental: { id: number; title: string | null },
  actorId: string,
) {
  return tx.auditLog.create({
    data: {
      action: "RENTAL_CREATED",
      entityType: "Rental",
      entityId: String(rental.id),
      actorId,
      message: `${rentalLabel(rental)} kérés létrehozva`,
    },
  });
}

// Fires the "your rental request was created" email. Fire-and-forget: mail failures
// must never fail the mutation that created the rental.
//
// DISABLED for now - only the status-change emails should send (see
// notifyStatusChanged below and its caller in rentals.ts). Remove this early
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
