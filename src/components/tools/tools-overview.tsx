"use client";

import { api } from "~/trpc/react";
import ToolItem from "./tool-item";

export default function ToolsOverview() {
  const { data: tools, error, isLoading } = api.tools.getAll.useQuery();

  return (
    <div className="">
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <div className="flex flex-col gap-4 md:grid md:grid-cols-4 xl:grid-cols-5">
        {tools?.map((tool) => <ToolItem key={tool.id} tool={tool} />)}
      </div>
    </div>
  );
}
