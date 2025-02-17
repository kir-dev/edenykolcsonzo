import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function RentingPage() {
  const tools = await api.tools.getAllWithRentalInfo();

  const session = await getServerAuthSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col items-center justify-center text-white">
        {/* <ToolsRentingOverview /> */}
        <div className="container mx-auto px-8 py-10">
          <DataTable columns={columns} data={tools} />
        </div>
      </main>
    </HydrateClient>
  );
}
