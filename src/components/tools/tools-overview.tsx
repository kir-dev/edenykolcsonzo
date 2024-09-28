"use client";

import { api } from "~/trpc/react";
import ToolItem from "./tool-item";

export default function ToolsOverview() {
  const { data: tools, error, isLoading } = api.tools.getAll.useQuery();

  return (
    <div>
      <h1>Konyhai eszközök</h1>
      <div className="">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {tools?.map((tool) => <ToolItem key={tool.id} tool={tool} />)}
      </div>
    </div>
  );
}
