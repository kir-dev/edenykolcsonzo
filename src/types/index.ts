import type { Tool, ToolRental } from "@prisma/client";

export interface ToolWithRentalInfo extends Tool {
  rentals: ToolRental[];
}

export type { Tool, ToolRental };
