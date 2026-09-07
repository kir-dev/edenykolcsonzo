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
