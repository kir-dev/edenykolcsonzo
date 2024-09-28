import ToolsOverview from "~/components/tools/tools-overview";

import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  void api.tools.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col bg-slate-200 p-4 text-white dark:bg-slate-800">
        <h1 className="mb-4 text-2xl font-bold text-black dark:text-white">
          Konyhai eszközök
        </h1>
        <ToolsOverview />
      </main>
    </HydrateClient>
  );
}
