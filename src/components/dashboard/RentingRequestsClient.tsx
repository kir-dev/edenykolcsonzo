"use client";

import { type RentalStatus } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import React from "react";

import RentingSection from "~/components/dashboard/RentingSection";
import { api } from "~/trpc/react"; // client-side TRPC hook
import { type RentalWithUserAndTools } from "~/types";

export default function RentalRequestsClient() {
  const queryClient = useQueryClient();
  const { data: rentals } = api.rentals.get.useQuery();

  const initialGrouped: Record<RentalStatus, RentalWithUserAndTools[]> = {
    REQUESTED: [],
    ACCEPTED: [],
    GIVEN_OUT: [],
    BROUGHT_BACK: [],
  };

  const updateStatusMutation = api.rentals.updateStatus.useMutation({
    onSuccess: () => {
      // Invalidate the rentals query manually
      const rentalsGetKey = getQueryKey(api.rentals.get, undefined, "query");

      queryClient.invalidateQueries({ queryKey: rentalsGetKey });
    },
  });

  const removeRentalMutation = api.rentals.remove.useMutation({
    onSuccess: () => {
      // Invalidate the rentals query manually
      const rentalsGetKey = getQueryKey(api.rentals.get, undefined, "query");

      queryClient.invalidateQueries({ queryKey: rentalsGetKey });
    },
  });

  const reduceQuantityMutation = api.rentals.changeQuantity.useMutation({
    onSuccess: () => {
      // Invalidate the rentals query manually
      const rentalsGetKey = getQueryKey(api.rentals.get, undefined, "query");

      queryClient.invalidateQueries({ queryKey: rentalsGetKey });
    },
  });

  const handleRemoveRental = (rentalId: number) => {
    removeRentalMutation.mutate(rentalId);
  };

  const handleReduceQuantity = (
    rentalId: number,
    toolId: number,
    quantity: number,
  ) => {
    reduceQuantityMutation.mutate({ rentalId, toolId, quantity });
  };

  const handleStatusChange = (rentalId: number, newStatus: RentalStatus) => {
    updateStatusMutation.mutate({ rentalId, status: newStatus });
  };

  if (!rentals) {
    return <div>Loading...</div>;
  }

  const groupedRentals = rentals.reduce((acc, rental) => {
    acc[rental.status].push(rental);
    return acc;
  }, initialGrouped);

  return (
    <div className="flex flex-col items-center p-6">
      <div className="bg-card w-full max-w-4xl rounded-3xl p-6 shadow-lg">
        <h1 className="mb-6 text-center text-4xl">Beérkezett Kérések</h1>
        {Object.entries(groupedRentals).map(([status, rentals]) => (
          <RentingSection
            key={status}
            status={status}
            rentals={rentals}
            handleStatusChange={handleStatusChange}
            handleRemoveRental={handleRemoveRental}
            handleReduceQuantity={handleReduceQuantity}
          />
        ))}
      </div>
    </div>
  );
}
