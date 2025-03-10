"use client";

import { type RentalStatus } from "@prisma/client";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { statusTitle } from "~/lib/utils";
import { type RentalWithUserAndTools } from "~/types";

function RentingSection(props: {
  status: string;
  rentals: RentalWithUserAndTools[];
  handleStatusChange: (id: number, status: RentalStatus) => void;
}) {
  const { status, rentals, handleStatusChange } = props;
  return (
    <section className="mb-2 flex w-2xl flex-col items-center">
      <h2 className="self-start text-3xl">
        {statusTitle(status as RentalStatus)}
      </h2>
      {rentals && rentals.length > 0 ? (
        rentals.map((rental) => (
          <div
            key={rental.id}
            className="my-1 flex w-2xl flex-row justify-between gap-5 rounded-md bg-gray-200 px-6 py-2 dark:bg-gray-700"
          >
            <div className="flex flex-col">
              <p>
                <strong>Bérlő:</strong>{" "}
                {rental.user.fullName ?? rental.user.email}{" "}
                <span>({new Date(rental.createdAt).toLocaleString()})</span>
              </p>
              <p>
                <strong>Eszközök:</strong> {rental.ToolRental[0]?.tool.name} (x
                {rental.ToolRental[0]?.quantity})
              </p>
            </div>
            <div className="flex flex-col">
              {" "}
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
          </div>
        ))
      ) : (
        <div className="my-1 flex flex-row justify-between rounded-md bg-gray-200 px-6 py-2 dark:bg-gray-700">
          <p>Nincs Beérkezett kérés ebben a kategóriában</p>
        </div>
      )}
    </section>
  );
}

export default RentingSection;
