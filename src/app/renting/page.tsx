import { redirect } from "next/navigation";

import RentingView from "~/components/rental/renting-view";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function RentingPage() {
  const tools = await api.tools.getAllWithRentalInfo();

  const session = await getServerAuthSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col items-center justify-center">
        <h1>Kölcsönzés</h1>
        <div className="container flex justify-center px-8 py-10">
          <RentingView tools={tools} />
        </div>
      </main>
    </HydrateClient>
  );
}
