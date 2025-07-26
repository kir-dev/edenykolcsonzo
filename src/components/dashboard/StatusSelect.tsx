"use client";

import { type RentalStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

interface StatusSelectProps {
  defaultValue: RentalStatus;
  onChange: (value: RentalStatus) => void;
}

export default function StatusSelect({
  defaultValue,
  onChange,
}: StatusSelectProps) {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value) => onChange(value as RentalStatus)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Státusz" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="REQUESTED">Beérkezett</SelectItem>
        <SelectItem value="ACCEPTED">Elfogadott</SelectItem>
        <SelectItem value="EXPIRED">Kiadott</SelectItem>
        <SelectItem value="BROUGHT_BACK">Visszahozott</SelectItem>
      </SelectContent>
    </Select>
  );
}
