"use client";

import { type RentalStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import React from "react";
import { type RentalWithUserAndTools } from "~/types";

function RentingSection(props: {
  status: string;
  rentals: RentalWithUserAndTools[];
  handleStatusChange: (id: number, status: RentalStatus) => void;
}) {
  const { status, rentals, handleStatusChange } = props;
  return (
    <section className="mb-2 flex flex-col items-center">
      <h2>{status}</h2>
      {rentals && rentals.length > 0 ? (
        rentals.map((rental) => (
          <div key={rental.id}>
            <p>
              <strong>User:</strong> {rental.user.fullName ?? rental.user.email}{" "}
              <span>({new Date(rental.createdAt).toLocaleString()})</span>
            </p>
            <p>
              <strong>Tool:</strong> {rental.ToolRental[0]?.tool.name} (x
              {rental.ToolRental[0]?.quantity})
            </p>
            <Select
              defaultValue={rental.status}
              onValueChange={(value) =>
                handleStatusChange(rental.id, value as RentalStatus)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Státusz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REQUESTED">Beérkezett</SelectItem>
                <SelectItem value="ACCEPTED">Elfogadott</SelectItem>
                <SelectItem value="EXPIRED">Kiadott</SelectItem>
                <SelectItem value="BROUGHT_BACK">Archív</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))
      ) : (
        <p>Nincs Beérkezett kérés ebben a kategóriában</p>
      )}
    </section>
  );
}

export default RentingSection;