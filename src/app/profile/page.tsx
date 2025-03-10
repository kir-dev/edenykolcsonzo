import { ClockArrowDown, ListOrdered, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { roleToTitle } from "~/lib/utils";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function ProfilePage() {
  const session = await getServerAuthSession();
  const rentals = await api.rentals.getUserRentals();

  const expiredRentals = rentals.filter(
    (rental) => rental.status === "EXPIRED" || rental.status === "BROUGHT_BACK",
  );
  const activeRentals = rentals.filter(
    (rental) => rental.status === "ACCEPTED" || rental.status === "REQUESTED",
  );

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="m-25 flex-col items-center justify-center">
      <div className="m-4 rounded-3xl bg-neutral-400 p-3.5 dark:bg-gray-800">
        <h2 className="flex flex-row items-center p-1.5">
          <UserRound />
          Profil
        </h2>
        <p className="flex p-1.5 py-0.5">
          {" "}
          <b className="mr-2">Név: </b> {session.user.name}
        </p>
        <p className="flex flex-row p-1.5">
          <b className="mr-2">Jogkör: </b>
          {roleToTitle(session.user.role)}
        </p>
        <div className="flex flex-col items-center">
          <Link
            href="/api/auth/signout"
            className="flex flex-row gap-2 rounded-4xl bg-neutral-500 p-3 transition-all hover:bg-neutral-600 dark:bg-gray-500 dark:hover:bg-gray-600"
          >
            <LogOut />
            Kijelentkezés
          </Link>
        </div>
      </div>
      <div className="m-4 rounded-3xl bg-neutral-400 p-3.5 dark:bg-gray-800">
        <h2 className="flex flex-row items-center p-1.5">
          <ClockArrowDown className="mr-1" />
          Aktív rendeléseim
        </h2>
        <Table>
          <TableHeader>
            <TableRow className="flex justify-between">
              <TableHead className="w-[100px] text-black dark:text-white">
                Azonosító
              </TableHead>
              <TableHead className="text-black dark:text-white">
                Státusz
              </TableHead>
              <TableHead className="text-black dark:text-white">
                Bérlés kezdete
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                Bérlés vége
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeRentals.length > 0 ? (
              activeRentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>{rental.id}</TableCell>
                  <TableCell>{rental.status}</TableCell>
                  <TableCell>{rental.startDate.toDateString()}</TableCell>
                  <TableCell className="text-right">
                    {rental.endDate.toDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center italic">
                  Nincs aktív rendelésed
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="m-4 rounded-3xl bg-neutral-400 p-3.5 dark:bg-gray-800">
        <h2 className="flex flex-row items-center p-1.5">
          <ListOrdered className="mr-0.5" />
          Archív rendeléseim
        </h2>
        <Table>
          <TableHeader>
            <TableRow className="flex justify-between">
              <TableHead className="w-[100px] text-black dark:text-white">
                Azonosító
              </TableHead>
              <TableHead className="text-black dark:text-white">
                Státusz
              </TableHead>
              <TableHead className="text-black dark:text-white">
                Bérlés kezdete
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                Bérlés vége
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expiredRentals.length > 0 ? (
              expiredRentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>{rental.id}</TableCell>
                  <TableCell>{rental.status}</TableCell>
                  <TableCell>{rental.startDate.toDateString()}</TableCell>
                  <TableCell className="text-right">
                    {rental.endDate.toDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center italic">
                  Még nincs archív rendelésed
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
