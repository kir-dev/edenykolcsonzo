"use client";
import { RentingDetails } from "~/types/renting";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { ToolWithRentalInfo } from "~/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StartRentalForm from "./start-rental-form";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { toast } from "sonner";
export default function RentingView({
  tools,
}: {
  tools: ToolWithRentalInfo[];
}) {
  const router = useRouter();
  const [rentingDetails, setRentingDetails] = useState<RentingDetails | null>(
    null,
  );
  const [selectedToolsMap, setSelectedToolsMap] = useState<
    Record<number, number>
  >({});

  const handleToolSelection = (toolId: number, amount: number) => {
    if (amount === 0) {
      setSelectedToolsMap((prev) => {
        const { [toolId]: _, ...rest } = prev;
        return rest;
      });
      return;
    }
    setSelectedToolsMap((prev) => ({
      ...prev,
      [toolId]: amount,
    }));
  };

  const createRentalMutation = api.rentals.createMultiple.useMutation({
    onSuccess: () => {
      toast.success("Bérlés sikeresen létrehozva!");
      setRentingDetails(null);
      setSelectedToolsMap({});
      router.push("/profile");
    },
    onError: (error) => {
      toast.error(`Hiba történt: ${error.message}`);
    },
  });

  const handleRent = () => {
    if (!rentingDetails) {
      toast.error("Hiányzó bérlési adatok!");
      return;
    }

    const selectedTools = Object.entries(selectedToolsMap)
      .filter(([_, quantity]) => quantity > 0)
      .map(([toolId, quantity]) => ({
        toolId: parseInt(toolId),
        quantity,
      }));

    if (selectedTools.length === 0) {
      toast.error("Válassz ki legalább egy edényt!");
      return;
    }

    // Combine date and time for start and end
    const startDateTime = new Date(rentingDetails.startDate);
    const [startHours, startMinutes] = rentingDetails.startTime.split(":");
    startDateTime.setHours(
      parseInt(startHours ?? "0"),
      parseInt(startMinutes ?? "0"),
      0,
      0,
    );

    const endDateTime = new Date(rentingDetails.endDate);
    const [endHours, endMinutes] = rentingDetails.endTime.split(":");
    endDateTime.setHours(
      parseInt(endHours ?? "0"),
      parseInt(endMinutes ?? "0"),
      0,
      0,
    );

    createRentalMutation.mutate({
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      startDateMessage: rentingDetails.startDateComment || "",
      endDateMessage: rentingDetails.endDateComment || "",
      tools: selectedTools,
    });
  };

  return (
    <>
      {rentingDetails ? (
        <div className="flex flex-col items-center gap-4">
          <DataTable
            columns={columns}
            data={tools}
            onToolSelection={handleToolSelection}
          />
          <Button onClick={handleRent} size="lg" className="w-fit">
            Bérlés véglegesítése
          </Button>
        </div>
      ) : (
        <StartRentalForm onSubmit={setRentingDetails} />
      )}
    </>
  );
}
