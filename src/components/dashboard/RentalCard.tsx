"use client";

import { type RentalStatus } from "@prisma/client";
import { format } from "date-fns";

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
import { type RentalWithUserAndTools } from "~/types";

import { QuantityDialog } from "./QuantityDialog";
import { RentalDetails } from "./RentalDetails";

// A single rental's card in RentingSection: its details, status control, and (when
// expanded) its per-tool list with quantity controls. Split out of RentingSection to
// keep that file's line count in check.
export function RentalCard(props: {
  rental: RentalWithUserAndTools;
  isExpanded: boolean;
  toggleExpanded: (id: number) => void;
  handleStatusChange: (id: number, status: RentalStatus) => void;
  handleRemoveRental: (id: number) => void;
  handleReduceQuantity: (
    rentalId: number,
    toolId: number,
    newQuantity: number,
  ) => void;
  openQuantityDialog: (
    rentalId: number,
    toolId: number,
    currentQuantity: number,
  ) => void;
  dialogData: {
    rentalId: number;
    toolId: number;
    open: boolean;
  } | null;
  newQuantity: number;
  setNewQuantity: (quantity: number) => void;
  confirmQuantityChange: () => void;
  cancelQuantityChange: () => void;
}) {
  const {
    rental,
    isExpanded,
    toggleExpanded,
    handleStatusChange,
    handleRemoveRental,
    handleReduceQuantity,
    openQuantityDialog,
    dialogData,
    newQuantity,
    setNewQuantity,
    confirmQuantityChange,
    cancelQuantityChange,
  } = props;

  return (
    <div className="bg-secondary my-2 w-full rounded-md px-3 py-2 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col">
          <p>
            <strong>Bérlés neve:</strong>{" "}
            {rental.title ?? `Bérlés #${rental.id}`}
          </p>
          <p>
            <strong>Bérlő:</strong> {rental.user.fullName ?? rental.user.email}
          </p>
          <p>
            <strong>Időszak:</strong>{" "}
            {format(rental.startDate, "yyyy. MM. dd.")} -{" "}
            {format(rental.endDate, "yyyy. MM. dd.")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status select */}
          <Select
            defaultValue={rental.status}
            onValueChange={(value) =>
              handleStatusChange(rental.id, value as RentalStatus)
            }
          >
            <SelectTrigger className="w-[130px] sm:w-[180px]">
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
              <DropdownMenuItem onClick={() => handleRemoveRental(rental.id)}>
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
        className={`overflow-y-auto transition-all duration-300 ${
          isExpanded ? "mt-2 max-h-[640px]" : "max-h-0 overflow-hidden"
        }`}
      >
        {isExpanded && (
          <div className="flex flex-col gap-2">
            <RentalDetails rental={rental} />
            {rental.ToolRental.map((toolRental) => (
              <div
                key={`${toolRental.rentalId}-${toolRental.toolId}`}
                className="bg-muted relative flex items-center gap-4 rounded-lg px-4 py-2"
              >
                <img
                  src={
                    toolRental.tool.image || "https://via.placeholder.com/50"
                  }
                  alt={toolRental.tool.name}
                  className="h-10 w-10 rounded object-cover"
                />
                <div className="flex flex-col">
                  <p className="font-medium">{toolRental.tool.name}</p>
                  <p className="text-sm">Mennyiség: {toolRental.quantity} db</p>
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
                        handleReduceQuantity(rental.id, toolRental.toolId, 0)
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
}
