import { format } from "date-fns";

import { type RentalWithUserAndTools } from "~/types";

// The expanded, non-tool details of a rental: group/contact, the exact
// pickup/dropoff timestamps alongside their free-text notes, and who
// accepted/gave out/took back the rental. Split out of RentalCard to keep
// that file's line count in check.
export function RentalDetails({ rental }: { rental: RentalWithUserAndTools }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-white/40 px-4 py-3 text-sm dark:bg-black/10">
      {(rental.group ?? rental.contactPhone) && (
        <div className="flex flex-col gap-1">
          {rental.group && (
            <p>
              <strong>Csoport:</strong> {rental.group.name}
            </p>
          )}
          {rental.contactPhone && (
            <p>
              <strong>Telefonszám:</strong> {rental.contactPhone}
            </p>
          )}
        </div>
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
      {(rental.acceptedBy ?? rental.givenOutBy ?? rental.returnedBy) && (
        <div className="flex flex-col gap-1 border-t border-black/10 pt-2 dark:border-white/10">
          {rental.acceptedBy && (
            <p>
              <strong>Elfogadta:</strong>{" "}
              {rental.acceptedBy.fullName ?? rental.acceptedBy.email}
            </p>
          )}
          {rental.givenOutBy && (
            <p>
              <strong>Kiadta:</strong>{" "}
              {rental.givenOutBy.fullName ?? rental.givenOutBy.email}
            </p>
          )}
          {rental.returnedBy && (
            <p>
              <strong>Visszavette:</strong>{" "}
              {rental.returnedBy.fullName ?? rental.returnedBy.email}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
