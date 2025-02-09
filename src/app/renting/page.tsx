import { redirect } from "next/navigation";
import ToolsRentingOverview from "~/components/tools/tools-renting-overview";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function RentingPage() {
  void api.tools.getAllWithRentalInfo.prefetch();

  const session = await getServerAuthSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col items-center justify-center text-white">
        <ToolsRentingOverview />
      </main>
    </HydrateClient>
  );
}
