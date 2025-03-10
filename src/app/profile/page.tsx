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
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function ProfilePage() {
  const session = await getServerAuthSession();
  const rentals = await api.rentals.getUserRentals();

  const expiredrentals = rentals.filter(
    (rental) => rental.status === "EXPIRED" || rental.status === "BROUGHT_BACK",
  );
  const activerentals = rentals.filter(
    (rental) => rental.status === "ACCEPTED" || rental.status === "REQUESTED",
  );

  if (!session || !session.user) {
    redirect("/login");
  }
  //className="bg-neutral-400"
  //<Link href="/api/auth/signout" className="rounded-4xl bg-neutral-400 p-3 flex flex-row gap-2 hover:bg-neutral-500 dark:bg-gray-500 dark:hover:bg-gray-600 transition-all"><LogOut />Kijelentkezés</Link>
  return (
    <div className="m-25 flex-col items-center justify-center">
      <div className="m-4 rounded-3xl bg-neutral-400 p-3.5 dark:bg-gray-800">
        <h2 className="flex flex-row items-center p-1.5">
          <UserRound />
          Profile
        </h2>
        <p className="flex p-1.5">{session.user.name}</p>
        <p className="flex flex-row p-1.5">{session.user.role}</p>
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
                Id
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
            {activerentals.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell>{rental.id}</TableCell>
                <TableCell>{rental.status}</TableCell>
                <TableCell>{rental.startDate.toDateString()}</TableCell>
                <TableCell className="text-right">
                  {rental.endDate.toDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="m-4 rounded-3xl bg-neutral-400 p-3.5 dark:bg-gray-800">
        <h2 className="flex flex-row items-center p-1.5">
          <ListOrdered className="mr-0.5" />
          Lejárt rendeléseim
        </h2>
        <Table>
          <TableHeader>
            <TableRow className="flex justify-between">
              <TableHead className="w-[100px] text-black dark:text-white">
                Id
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
            {expiredrentals.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell>{rental.id}</TableCell>
                <TableCell>{rental.status}</TableCell>
                <TableCell>{rental.startDate.toDateString()}</TableCell>
                <TableCell className="text-right">
                  {rental.endDate.toDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
