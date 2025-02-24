"use client";

import { api } from "~/trpc/react";

import ToolItemWithRentalInfo from "./tool-item-with-rental-info";

export default function ToolsRentingOverview() {
  const {
    data: tools,
    error,
    isLoading,
  } = api.tools.getAllWithRentalInfo.useQuery();

  if (isLoading) {
    console.log("loading");
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return <p>Error: {error.message}</p>;
  }

  console.log(tools);

  return (
    <div className="">
      {isLoading && <p>Loading...</p>}
      {/* {error && <p>Error: {error.message}</p>} */}
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
        {tools?.map((tool) => (
          <ToolItemWithRentalInfo key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
