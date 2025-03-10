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
    case "EXPIRED":
      return "Kiadott";
    case "BROUGHT_BACK":
      return "Archív";
  }
}

export function roleToTitle(role: Role) {
  switch (role) {
    case "EK_MEMBER":
      return "Edénykölcsönző tag";
    case "USER":
      return "Bérlő";
  }
}
