import ToolsOverview from "~/components/tools/tools-overview";

import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  void api.tools.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <ToolsOverview />
      </main>
    </HydrateClient>
  );
}
