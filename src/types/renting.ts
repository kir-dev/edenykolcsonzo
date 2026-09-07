import type { Tool } from "@prisma/client";
export type RentingDetails = {
  title: string;
  startDate: Date;
  startTime: string;
  startDateComment?: string;
  endDate: Date;
  endTime: string;
  endDateComment?: string;
  groupId?: number;
};
export type ToolRental = {
  tool: Tool;
  quantity: number;
};
