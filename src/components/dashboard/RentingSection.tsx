"use client";

import { type RentalStatus } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

import { statusTitle } from "~/lib/utils";
import { type RentalWithUserAndTools } from "~/types";

import { RentalCard } from "./RentalCard";

function RentingSection(props: {
  status: string;
  rentals: RentalWithUserAndTools[];
  canSetAnyStatus: boolean;
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
    canSetAnyStatus,
    handleStatusChange,
    handleRemoveRental,
    handleReduceQuantity,
  } = props;
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  // Brought back rentals pile up over time, so that section starts collapsed.
  const isCollapsible = status === "BROUGHT_BACK";
  const [isCollapsed, setIsCollapsed] = useState(isCollapsible);
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
    <section className="mb-4 flex w-full max-w-2xl min-w-0 flex-col lg:max-w-none">
      {isCollapsible ? (
        <button
          className="mb-2 flex items-center gap-2 text-left"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-expanded={!isCollapsed}
        >
          <h2 className="text-xl sm:text-3xl">
            {statusTitle(status as RentalStatus)} ({rentals.length})
          </h2>
          <ChevronDown
            className={`h-6 w-6 transition-transform duration-300 ${
              isCollapsed ? "" : "rotate-180"
            }`}
          />
        </button>
      ) : (
        <h2 className="mb-2 text-xl sm:text-3xl">
          {statusTitle(status as RentalStatus)}
        </h2>
      )}
      {!isCollapsed &&
        (rentals && rentals.length > 0 ? (
          rentals.map((rental) => (
            <RentalCard
              key={rental.id}
              rental={rental}
              isExpanded={expandedIds.includes(rental.id)}
              canSetAnyStatus={canSetAnyStatus}
              toggleExpanded={toggleExpanded}
              handleStatusChange={handleStatusChange}
              handleRemoveRental={handleRemoveRental}
              handleReduceQuantity={handleReduceQuantity}
              openQuantityDialog={openQuantityDialog}
              dialogData={dialogData}
              newQuantity={newQuantity}
              setNewQuantity={setNewQuantity}
              confirmQuantityChange={confirmQuantityChange}
              cancelQuantityChange={cancelQuantityChange}
            />
          ))
        ) : (
          <div className="bg-secondary my-2 w-full rounded-xl px-6 py-3">
            <p>Nincs Beérkezett kérés ebben a kategóriában</p>
          </div>
        ))}
    </section>
  );
}

export default RentingSection;
