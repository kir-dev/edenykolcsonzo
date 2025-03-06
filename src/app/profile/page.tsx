import { ClockArrowDown, ListOrdered, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

export default async function ProfilePage() {
    const session = await getServerAuthSession();
    const rentals = await api.rentals.getUserRentals();

    const expiredrentals = rentals.filter(rental => rental.status == "EXPIRED" || rental.status == "BROUGHT_BACK");
    const activerentals = rentals.filter(rental => rental.status == "ACCEPTED" || rental.status == "REQUESTED"); 

    if (!session || !session.user) {
        redirect("/login");
    }
    //className="bg-neutral-400"
    //<Link href="/api/auth/signout" className="rounded-4xl bg-neutral-400 p-3 flex flex-row gap-2 hover:bg-neutral-500 dark:bg-gray-500 dark:hover:bg-gray-600 transition-all"><LogOut />Kijelentkezés</Link>
    return (
        <div className="m-25 flex-col items-center justify-center">
            <div className="rounded-3xl bg-neutral-400 p-3.5 dark:bg-gray-800 m-4">
                <h2 className="flex flex-row p-1.5 items-center"><UserRound />Profile</h2>
                <p className="flex p-1.5">{session.user.name}</p>
                <p className="flex flex-row p-1.5">{session.user.role}</p>
                <div className="flex flex-col items-center">
                  <Link href="/api/auth/signout" className="rounded-4xl bg-neutral-500 p-3 flex flex-row gap-2 hover:bg-neutral-600 dark:bg-gray-500 dark:hover:bg-gray-600 transition-all"><LogOut />Kijelentkezés</Link>
                </div>
            </div>
            <div className="rounded-3xl bg-neutral-400 p-3.5 dark:bg-gray-800 m-4">
                <h2 className="flex flex-row p-1.5 items-center"><ClockArrowDown className="mr-1"/>Aktív rendeléseim</h2>
                <Table>
                  <TableHeader>
                    <TableRow className="flex justify-between">
                      <TableHead className="w-[100px] text-black dark:text-white">Id</TableHead>
                      <TableHead className="text-black dark:text-white">Státusz</TableHead>
                      <TableHead className="text-black dark:text-white">Bérlés kezdete</TableHead>
                      <TableHead className="text-right text-black dark:text-white">Bérlés vége</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activerentals.map((rental) => (
                      <TableRow key={rental.id}>
                        <TableCell>{rental.id}</TableCell>
                        <TableCell>{rental.status}</TableCell>
                        <TableCell>{rental.startDate.toDateString()}</TableCell>
                        <TableCell className="text-right">{rental.endDate.toDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </div>
            <div className="rounded-3xl bg-neutral-400 p-3.5 dark:bg-gray-800 m-4">
              <h2 className="flex flex-row p-1.5 items-center"><ListOrdered className="mr-0.5"/>Lejárt rendeléseim</h2>
                <Table>
                  <TableHeader>
                    <TableRow className="flex justify-between">
                      <TableHead className="w-[100px] text-black dark:text-white">Id</TableHead>
                      <TableHead className="text-black dark:text-white">Státusz</TableHead>
                      <TableHead className="text-black dark:text-white">Bérlés kezdete</TableHead>
                      <TableHead className="text-right text-black dark:text-white">Bérlés vége</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiredrentals.map((rental) => (
                      <TableRow key={rental.id}>
                        <TableCell>{rental.id}</TableCell>
                        <TableCell>{rental.status}</TableCell>
                        <TableCell>{rental.startDate.toDateString()}</TableCell>
                        <TableCell className="text-right">{rental.endDate.toDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </div>
        </div>
    );
}
