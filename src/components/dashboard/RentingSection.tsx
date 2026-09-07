"use client";

import { type RentalStatus } from "@prisma/client";
import React, { useState } from "react";

import { statusTitle } from "~/lib/utils";
import { type RentalWithUserAndTools } from "~/types";

import { RentalCard } from "./RentalCard";

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
    <section className="mb-4 flex w-full max-w-2xl flex-col">
      <h2 className="mb-2 text-xl sm:text-3xl">
        {statusTitle(status as RentalStatus)}
      </h2>
      {rentals && rentals.length > 0 ? (
        rentals.map((rental) => (
          <RentalCard
            key={rental.id}
            rental={rental}
            isExpanded={expandedIds.includes(rental.id)}
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
      )}
    </section>
  );
}

export default RentingSection;
