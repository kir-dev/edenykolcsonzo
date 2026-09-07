import { ClockArrowDown, ListOrdered, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import ProfileHeader from "~/components/common/ProfileHeader";
import ProfilePhoneNumber from "~/components/common/ProfilePhoneNumber";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { roleToTitle, statusTitle } from "~/lib/utils";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function ProfilePage() {
  const session = await getServerAuthSession();
  const rentals = await api.rentals.getUserRentals();
  // eslint-disable-next-line no-void
  void api.users.getCurrentUser.prefetch();

  const expiredRentals = rentals.filter(
    (rental) => rental.status === "BROUGHT_BACK",
  );
  const activeRentals = rentals.filter(
    (rental) => rental.status === "ACCEPTED" || rental.status === "REQUESTED",
  );

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <HydrateClient>
      <div className="mx-4 my-4 flex-col items-center justify-center sm:mx-8 md:mx-16 lg:mx-24">
        <div className="bg-card m-4 rounded-3xl p-3.5 shadow-lg">
          <h2 className="flex flex-row items-center p-1.5">
            <UserRound />
            Profil
          </h2>
          <div className="mb-4 flex justify-center">
            <ProfileHeader
              userName={session.user.name || "Felhasználó"}
              userRole={session.user.role}
            />
          </div>
          <p className="flex p-1.5 py-0.5">
            {" "}
            <b className="mr-2">Név: </b> {session.user.name}
          </p>
          <p className="flex flex-row p-1.5">
            <b className="mr-2">Jogkör: </b>
            {roleToTitle(session.user.role)}
          </p>
          <ProfilePhoneNumber />
          <div className="flex flex-col items-center">
            <Link
              href="/api/auth/signout"
              className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 flex flex-row gap-2 rounded-4xl bg-amber-500 p-3 text-white transition-all hover:bg-amber-600"
            >
              <LogOut />
              Kijelentkezés
            </Link>
          </div>
        </div>
        <div className="bg-card m-4 rounded-3xl p-3.5 shadow-lg">
          <h2 className="flex flex-row items-center p-1.5">
            <ClockArrowDown className="mr-1" />
            Aktív rendeléseim
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] text-black dark:text-white">
                    Azonosító
                  </TableHead>
                  <TableHead className="text-black dark:text-white">
                    Neve
                  </TableHead>
                  <TableHead className="text-black dark:text-white">
                    Eszközök
                  </TableHead>
                  <TableHead className="text-black dark:text-white">
                    Státusz
                  </TableHead>
                  <TableHead className="text-black dark:text-white">
                    Bérlés kezdete
                  </TableHead>
                  <TableHead className="text-black dark:text-white">
                    Megjegyzés
                  </TableHead>
                  <TableHead className="text-black dark:text-white">
                    Bérlés vége
                  </TableHead>
                  <TableHead className="hidden text-black sm:table-cell dark:text-white">
                    Megjegyzés
                  </TableHead>
                  <TableHead className="text-black dark:text-white" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeRentals.length > 0 ? (
                  activeRentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell>{rental.id}</TableCell>
                      <TableCell>
                        {rental.title ?? `Bérlés #${rental.id}`}
                      </TableCell>
                      <TableCell>
                        <ul>
                          {rental.ToolRental.map((toolRental) => (
                            <li key={toolRental.toolId}>
                              {toolRental.tool.name} ({toolRental.quantity} db)
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>{statusTitle(rental.status)}</TableCell>
                      <TableCell>{rental.startDate.toDateString()}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {rental.startDateMessage}
                      </TableCell>
                      <TableCell>{rental.endDate.toDateString()}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {rental.endDateMessage}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/renting?repeat=${rental.id}`}
                          className="text-primary underline"
                        >
                          Bérlés újra
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center italic">
                      Nincs aktív rendelésed
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="bg-card m-4 rounded-3xl p-3.5 shadow-lg">
          <h2 className="flex flex-row items-center p-1.5">
            <ListOrdered className="mr-0.5" />
            Archív rendeléseim
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] text-black dark:text-white">
                    Azonosító
                  </TableHead>
                  <TableHead className="text-black dark:text-white">
                    Neve
                  </TableHead>
                  <TableHead className="text-black dark:text-white">
                    Eszközök
                  </TableHead>
                  <TableHead className="text-black dark:text-white">
                    Státusz
                  </TableHead>
                  <TableHead className="text-black dark:text-white">
                    Bérlés kezdete
                  </TableHead>
                  <TableHead className="hidden text-black sm:table-cell dark:text-white">
                    Megjegyzés
                  </TableHead>
                  <TableHead className="text-black dark:text-white">
                    Bérlés vége
                  </TableHead>
                  <TableHead className="hidden text-black sm:table-cell dark:text-white">
                    Megjegyzés
                  </TableHead>
                  <TableHead className="text-black dark:text-white" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiredRentals.length > 0 ? (
                  expiredRentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell>{rental.id}</TableCell>
                      <TableCell>
                        {rental.title ?? `Bérlés #${rental.id}`}
                      </TableCell>
                      <TableCell>
                        <ul>
                          {rental.ToolRental.map((toolRental) => (
                            <li key={toolRental.toolId}>
                              {toolRental.tool.name} ({toolRental.quantity} db)
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>{statusTitle(rental.status)}</TableCell>
                      <TableCell>{rental.startDate.toDateString()}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {rental.startDateMessage}
                      </TableCell>
                      <TableCell>{rental.endDate.toDateString()}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {rental.endDateMessage}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/renting?repeat=${rental.id}`}
                          className="text-primary underline"
                        >
                          Bérlés újra
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center italic">
                      Még nincs archív rendelésed
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
