import { format } from "date-fns";

import { type RentalWithUserAndTools } from "~/types";

// The expanded, non-tool details of a rental: contact phone, the exact
// pickup/dropoff timestamps alongside their free-text notes, and who accepted
// the rental (the group and who gave it out/took it back are shown on the card
// itself). Split out of RentalCard to keep that file's line count in check.
export function RentalDetails({ rental }: { rental: RentalWithUserAndTools }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-white/40 px-4 py-3 text-sm dark:bg-black/10">
      {rental.contactPhone && (
        <p>
          <strong>Telefonszám:</strong> {rental.contactPhone}
        </p>
      )}
      <p>
        <strong>Kérés beküldve:</strong>{" "}
        {format(rental.createdAt, "yyyy. MM. dd. HH:mm")}
      </p>
      <div className="flex flex-col gap-1">
        <p>
          <strong>Kezdés időpontja:</strong>{" "}
          {format(rental.startDate, "yyyy. MM. dd. HH:mm")}
        </p>
        {rental.startDateMessage && (
          <p className="text-muted-foreground">
            <strong>Megjegyzés:</strong> {rental.startDateMessage}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p>
          <strong>Leadás időpontja:</strong>{" "}
          {format(rental.endDate, "yyyy. MM. dd. HH:mm")}
        </p>
        {rental.endDateMessage && (
          <p className="text-muted-foreground">
            <strong>Megjegyzés:</strong> {rental.endDateMessage}
          </p>
        )}
      </div>
      {rental.acceptedBy && (
        <p className="border-t border-black/10 pt-2 dark:border-white/10">
          <strong>Elfogadta:</strong>{" "}
          {rental.acceptedBy.fullName ?? rental.acceptedBy.email}
        </p>
      )}
    </div>
  );
}
