"use client";

import { format } from "date-fns";

import { api } from "~/trpc/react";

export default function AuditLogList() {
  const { data: logs, isLoading } = api.auditLog.list.useQuery();

  return (
    <div className="flex flex-col items-center p-6">
      <div className="bg-card w-full max-w-4xl rounded-3xl p-6 shadow-lg">
        <h1 className="mb-4 text-2xl sm:text-4xl">Napló</h1>
        {isLoading && <div>Betöltés...</div>}
        {!isLoading && (!logs || logs.length === 0) && (
          <div className="bg-secondary my-2 w-full rounded-xl px-6 py-3">
            <p>Nincs még naplóbejegyzés</p>
          </div>
        )}
        {!isLoading && logs && logs.length > 0 && (
          <div className="flex flex-col gap-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-secondary flex flex-col gap-1 rounded-md px-3 py-2 sm:px-6"
              >
                <p>{log.message}</p>
                <p className="text-muted-foreground text-sm">
                  {format(log.createdAt, "yyyy. MM. dd. HH:mm:ss")} &middot;{" "}
                  {log.actor
                    ? (log.actor.fullName ?? log.actor.email)
                    : "Ismeretlen felhasználó"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
