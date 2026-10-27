import { type RentalStatus, Role } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function statusTitle(status: RentalStatus) {
  switch (status) {
    case "REQUESTED":
      return "Beérkezett";
    case "ACCEPTED":
      return "Elfogadott";
    case "GIVEN_OUT":
      return "Kiadott";
    case "BROUGHT_BACK":
      return "Visszahozott";
  }
}

export function roleToTitle(role: Role) {
  switch (role) {
    case "EK_MEMBER":
      return "Edénykölcsönző tag";
    case "ADMIN":
      return "Admin";
    case "USER":
      return "Bérlő";
  }
}

// EK_MEMBER and ADMIN both get circle-member-level access; ADMIN is granted manually
// and is never derived from (or reset by) the SSO login sync in ~/server/auth.ts.
export function isAdminRole(role: Role | string | null | undefined) {
  return role === Role.EK_MEMBER || role === Role.ADMIN;
}

// Rentals normally only move forward one step at a time (see nextStatus). Admins and
// the EK group leader may also move them into any status, e.g. to undo a mistake.
export function canSetAnyStatus(
  user: { role: Role | string; ekLeader?: boolean } | null | undefined,
) {
  return user?.role === Role.ADMIN || (user?.ekLeader ?? false);
}

const STATUS_ORDER: RentalStatus[] = [
  "REQUESTED",
  "ACCEPTED",
  "GIVEN_OUT",
  "BROUGHT_BACK",
];

// How a rental is referred to in the audit log: its name and id, or just the id when
// it has no name.
export function rentalLabel(rental: { id: number; title: string | null }) {
  return rental.title ? `${rental.title} (#${rental.id})` : `#${rental.id}`;
}

// Older audit log entries were written with the raw status names (e.g. "GIVEN_OUT")
// in their message, so the logs page translates any quoted status name on display.
export function translateStatusNames(message: string) {
  return message.replace(
    /"(REQUESTED|ACCEPTED|GIVEN_OUT|BROUGHT_BACK)"/g,
    (_, status: RentalStatus) => `"${statusTitle(status)}"`,
  );
}

// The status a rental moves into next, or null once it's been brought back.
export function nextStatus(status: RentalStatus): RentalStatus | null {
  return STATUS_ORDER[STATUS_ORDER.indexOf(status) + 1] ?? null;
}

// The label of the button that moves a rental into the given status.
export function statusActionTitle(status: RentalStatus) {
  switch (status) {
    case "REQUESTED":
      return "Visszaállítás";
    case "ACCEPTED":
      return "Elfogadás";
    case "GIVEN_OUT":
      return "Kiadás";
    case "BROUGHT_BACK":
      return "Visszavétel";
  }
}
