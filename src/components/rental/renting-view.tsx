"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { api } from "~/trpc/react";
import { RentingDetails } from "~/types/renting";

import { Button } from "../ui/button";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import StartRentalForm from "./start-rental-form";

export default function RentingView() {
  const router = useRouter();
  const [rentingDetails, setRentingDetails] = useState<RentingDetails | null>(
    null,
  );
  const [selectedToolsMap, setSelectedToolsMap] = useState<
    Record<number, number>
  >({});

  // Calculate start and end datetime from rentingDetails
  const dateRange = useMemo(() => {
    if (!rentingDetails) return null;

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

    return {
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
    };
  }, [rentingDetails]);

  // Fetch available tools only after dates are selected
  const {
    data: availableTools,
    isLoading: isLoadingTools,
    isError: isToolsError,
    error: toolsError,
  } = api.tools.getAvailableInPeriod.useQuery(
    {
      startDate: dateRange?.startDate ?? "",
      endDate: dateRange?.endDate ?? "",
    },
    { enabled: Boolean(dateRange) },
  );

  const handleToolSelection = (toolId: number, amount: number) => {
    if (amount === 0) {
      setSelectedToolsMap((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [toolId]: _unused, ...rest } = prev;
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
    if (!rentingDetails || !dateRange) {
      toast.error("Hiányzó bérlési adatok!");
      return;
    }

    const selectedTools = Object.entries(selectedToolsMap)
      .filter(([, quantity]) => quantity > 0)
      .map(([toolId, quantity]) => ({
        toolId: parseInt(toolId),
        quantity,
      }));

    if (selectedTools.length === 0) {
      toast.error("Válassz ki legalább egy edényt!");
      return;
    }

    createRentalMutation.mutate({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      startDateMessage: rentingDetails.startDateComment || "",
      endDateMessage: rentingDetails.endDateComment || "",
      tools: selectedTools,
    });
  };

  if (createRentalMutation.isPending) {
    return <div>Loading...</div>;
  }
  if (createRentalMutation.isError) {
    return <div>Error: {createRentalMutation.error.message}</div>;
  }
  if (!rentingDetails) {
    return <StartRentalForm onSubmit={setRentingDetails} />;
  }

  if (isLoadingTools) {
    return <div className="text-center">Elérhető eszközök betöltése...</div>;
  }

  if (isToolsError) {
    return (
      <div className="text-center text-red-500">
        Hiba: {toolsError?.message}
      </div>
    );
  }

  if (!availableTools || availableTools.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-lg">
          Nincs elérhető eszköz a kiválasztott időszakban.
        </p>
        <Button onClick={() => setRentingDetails(null)} variant="outline">
          Másik időszak választása
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <DataTable
        columns={columns}
        data={availableTools}
        onToolSelection={handleToolSelection}
      />
      <Button onClick={handleRent} size="lg" className="w-fit">
        Bérlés véglegesítése
      </Button>
    </div>
  );
}
