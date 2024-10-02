import ToolsRentingOverview from "~/components/tools/tools-renting-overview";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function RentingPage() {
  const session = await getServerAuthSession();

  void api.tools.get.prefetch();

  if (!session || !session.user) {
    return null;
  }

  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col items-center justify-center text-white">
        <ToolsRentingOverview />
      </main>
    </HydrateClient>
  );
}
