import ToolsOverview from "~/components/tools/tools-overview";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  api.tools.getAll.prefetch();
  const session = await getServerAuthSession();
  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col p-4">
        <h2 className="mb-4 text-2xl font-bold">
          Konyhai eszközök
        </h2>
        <ToolsOverview session={session} />
      </main>
    </HydrateClient>
  );
}
