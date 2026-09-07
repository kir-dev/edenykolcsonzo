"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

export default function MemberSummaryList() {
  const { data: members, isLoading } = api.users.getMemberStats.useQuery();

  return (
    <div className="flex flex-col items-center p-6">
      <div className="bg-card w-full max-w-4xl rounded-3xl p-6 shadow-lg">
        <h1 className="mb-4 text-2xl sm:text-4xl">Tagok összesítője</h1>
        {isLoading && <div>Betöltés...</div>}
        {!isLoading && (!members || members.length === 0) && (
          <div className="bg-secondary my-2 w-full rounded-xl px-6 py-3">
            <p>Nincs még edénykölcsönző tag</p>
          </div>
        )}
        {!isLoading && members && members.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black dark:text-white">
                    Tag
                  </TableHead>
                  <TableHead className="text-black dark:text-white">
                    Kiadott bérlések
                  </TableHead>
                  <TableHead className="text-black dark:text-white">
                    Visszavett bérlések
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      {member.fullName ?? member.nickname ?? member.email}
                    </TableCell>
                    <TableCell>{member.givenOutCount}</TableCell>
                    <TableCell>{member.returnedCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
