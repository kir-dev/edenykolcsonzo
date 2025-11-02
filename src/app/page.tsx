import Members from "~/components/common/members";
import ToolsOverview from "~/components/tools/tools-overview";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  void api.tools.getAll.prefetch();
  const session = await getServerAuthSession();
  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col bg-slate-200 p-4 text-white dark:bg-slate-800">
        <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
          Konyhai eszközök
        </h2>
        <ToolsOverview session={session} />
      </main>
    </HydrateClient>
  );
}
