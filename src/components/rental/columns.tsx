"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

// Extended type that includes availableQuantity from getAvailableInPeriod
type ToolWithAvailability = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  rentable: boolean;
  image: string | null;
  availableQuantity: number;
  rentals: unknown[];
};

export const columns: ColumnDef<ToolWithAvailability>[] = [
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
    header: "Leírás",
  },
  {
    accessorKey: "availableQuantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Elérhető
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const tool = row.original;
      return <div className="text-center">{tool.availableQuantity}</div>;
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
        if (newAmount > tool.availableQuantity) {
          toast.error(`Nincs ennyi ${tool.name}! ${tool.availableQuantity} darab elérhető!`);
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
