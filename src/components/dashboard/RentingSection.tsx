"use client";

import { type RentalStatus } from "@prisma/client";
import { format } from "date-fns";
import React, { useState } from "react";

// Dropdown Menu components for rental removal and tool options
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { statusTitle } from "~/lib/utils";
import { type RentalWithUserAndTools } from "~/types";

import { QuantityDialog } from "./QuantityDialog";

function RentingSection(props: {
  status: string;
  rentals: RentalWithUserAndTools[];
  handleStatusChange: (id: number, status: RentalStatus) => void;
  handleRemoveRental: (id: number) => void;
  handleReduceQuantity: (
    rentalId: number,
    toolId: number,
    newQuantity: number,
  ) => void;
}) {
  const {
    status,
    rentals,
    handleStatusChange,
    handleRemoveRental,
    handleReduceQuantity,
  } = props;
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [dialogData, setDialogData] = useState<{
    rentalId: number;
    toolId: number;
    currentQuantity: number;
    open: boolean;
  } | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const openQuantityDialog = (
    rentalId: number,
    toolId: number,
    currentQuantity: number,
  ) => {
    setDialogData({ rentalId, toolId, currentQuantity, open: true });
    setNewQuantity(currentQuantity);
  };

  const confirmQuantityChange = () => {
    if (dialogData) {
      handleReduceQuantity(dialogData.rentalId, dialogData.toolId, newQuantity);
      setDialogData(null);
    }
  };

  const cancelQuantityChange = () => {
    setDialogData(null);
  };

  return (
    <section className="mb-4 w-full">
      <h2 className="mb-2 text-2xl font-semibold">
        {statusTitle(status as RentalStatus)}
      </h2>
      {rentals && rentals.length > 0 ? (
        rentals.map((rental) => {
          const isExpanded = expandedIds.includes(rental.id);
          return (
            <div
              key={rental.id}
              className="my-2 w-full rounded-xl bg-secondary px-6 py-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <p>
                    <strong>Bérlő:</strong>{" "}
                    {rental.user.fullName ?? rental.user.email}
                  </p>
                  <p>
                    <strong>Leadás időpontja:</strong>{" "}
                    <span>
                      ({format(rental.createdAt, "yyyy. MM. dd. HH:mm")})
                    </span>
                  </p>
                  <p>
                    <strong>Eszközök:</strong>{" "}
                    {rental.ToolRental.map(
                      (toolRental, idx) =>
                        `${toolRental.tool.name} (${toolRental.quantity}x)${idx === rental.ToolRental.length - 1 ? "" : ", "
                        }`,
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Status select */}
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
                      <SelectItem value="GIVEN_OUT">Kiadott</SelectItem>
                      <SelectItem value="BROUGHT_BACK">Visszahozott</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Rental removal three-dot button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v.01M12 12v.01M12 18v.01"
                          />
                        </svg>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleRemoveRental(rental.id)}
                      >
                        Kérés törlése
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <button onClick={() => toggleExpanded(rental.id)}>
                    {isExpanded ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 rotate-180 transform transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 transform transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${isExpanded ? "mt-2 max-h-96" : "max-h-0"
                  }`}
              >
                {isExpanded && (
                  <div className="flex flex-col gap-2">
                    {rental.ToolRental.map((toolRental) => (
                      <div
                        key={`${toolRental.rentalId}-${toolRental.toolId}`}
                        className="relative flex items-center gap-4 rounded-lg bg-muted px-4 py-2"
                      >
                        <img
                          src={
                            toolRental.tool.image ||
                            "https://via.placeholder.com/50"
                          }
                          alt={toolRental.tool.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div className="flex flex-col">
                          <p className="font-medium">{toolRental.tool.name}</p>
                          <p className="text-sm">
                            Mennyiség: {toolRental.quantity} db
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="ml-auto p-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 6v.01M12 12v.01M12 18v.01"
                                />
                              </svg>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() =>
                                openQuantityDialog(
                                  rental.id,
                                  toolRental.toolId,
                                  toolRental.quantity,
                                )
                              }
                            >
                              Mennyiség megváltoztatása
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleReduceQuantity(
                                  rental.id,
                                  toolRental.toolId,
                                  0,
                                )
                              }
                            >
                              Eszköz törlése
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {dialogData &&
                          dialogData.open &&
                          dialogData.rentalId === rental.id &&
                          dialogData.toolId === toolRental.toolId && (
                            <QuantityDialog
                              open
                              newQuantity={newQuantity}
                              setNewQuantity={setNewQuantity}
                              onConfirm={confirmQuantityChange}
                              onCancel={cancelQuantityChange}
                            />
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="my-2 w-full rounded-xl bg-secondary px-6 py-3">
          <p>Nincs Beérkezett kérés ebben a kategóriában</p>
        </div>
      )}
    </section>
  );
}

export default RentingSection;
