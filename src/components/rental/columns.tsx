"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { ToolWithRentalInfo } from "~/types";

export const columns: ColumnDef<ToolWithRentalInfo>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Név
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => <span className="hidden sm:inline">Leírás</span>,
    cell: ({ row }) => (
      <span className="hidden sm:inline">{row.original.description}</span>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Darabszám
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const tool = row.original;
      return <div className="text-center">{tool.quantity}</div>;
    },
  },
  {
    id: "actions",
    header: "Bérlés",
    cell: ({ row, column }) => {
      const [amount, setAmount] = useState(0);
      const tool = row.original;
      const onToolSelection = (
        column.columnDef.meta as {
          onToolSelection?: (toolId: number, amount: number) => void;
        }
      )?.onToolSelection;

      const handleAmountChange = (newAmount: number) => {
        if (newAmount > tool.quantity) {
          toast.error(`Nincs ennyi ${tool.name}! ${tool.quantity} darab van!`);
          return;
        }
        setAmount(newAmount);
        if (onToolSelection) {
          onToolSelection(tool.id, newAmount);
        }
      };

      if (amount === 0) {
        return (
          <Button
            variant="default"
            className="mx-1"
            onClick={() => handleAmountChange(1)}
          >
            Bérlés
          </Button>
        );
      }
      return (
        <Input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => handleAmountChange(parseInt(e.target.value) || 0)}
          placeholder="Mennyiség"
          className="w-20"
        />
      );
    },
  },
];
