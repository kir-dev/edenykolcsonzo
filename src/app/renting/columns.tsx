"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ToolWithRentalInfo } from "~/types";

export const columns: ColumnDef<ToolWithRentalInfo>[] = [
  {
    accessorKey: "name",
    header: "Név",
  },
  {
    accessorKey: "description",
    header: "Leírás",
  },
  {
    accessorKey: "quantity",
    header: "Darabszám",
  },
  {
    accessorKey: "rentals",
    header: "Kölcsönzések",
  },
];
