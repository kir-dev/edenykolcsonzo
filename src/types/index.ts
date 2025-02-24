import type { Rental, Tool, ToolRental, User } from "@prisma/client";

export interface ToolWithRentalInfo extends Tool {
  rentals: ToolRental[];
}

export interface ToolRentalWithTool extends ToolRental {
  tool: Tool;
}

export type { Tool, ToolRental };

export interface RentalWithUserAndTools extends Rental {
  user: User;
  ToolRental: ToolRentalWithTool[];
}
