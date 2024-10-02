import Members from "~/components/common/members";
import ToolsOverview from "~/components/tools/tools-overview";

import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  void api.tools.get.prefetch();

  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col bg-slate-200 p-4 text-white dark:bg-slate-800">
        <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
          Konyhai eszközök
        </h2>
        <ToolsOverview />
        <h2 className="mb-4 mt-12 text-2xl font-bold text-black dark:text-white">
          Körtagok
        </h2>
        <Members />
      </main>
    </HydrateClient>
  );
}
