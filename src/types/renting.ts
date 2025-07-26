import type { Tool } from "@prisma/client";
export type RentingDetails = {
  startDate: Date;
  startTime: string;
  startDateComment?: string;
  endDate: Date;
  endTime: string;
  endDateComment?: string;
};
export type ToolRental = {
  tool: Tool;
  quantity: number;
};
