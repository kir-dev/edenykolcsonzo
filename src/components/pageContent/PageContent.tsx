"use client";

import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

import { api } from "~/trpc/react"; // client-side TRPC hook

import Markdown from "../common/markdown";
import Members from "../common/members";
import { Button } from "../ui/button";

interface PageContentProps {
  role: string | undefined;
}

export default function PageContent({ role }: PageContentProps) {
  const { data: pageContent, isLoading } =
    api.pageContent.get.useQuery("ABOUT");
  const isEKmember = role === Role.EK_MEMBER;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-6 sm:px-6">
      {/* Text content - stays narrow for readability */}
      <div className="flex w-full max-w-2xl flex-col items-center">
        <h1 className="mb-4 text-center text-2xl font-semibold sm:mb-6 sm:text-4xl">
          Rólunk
        </h1>

        <div className="prose text-center text-base sm:text-lg">
          <Markdown content={pageContent?.content ?? ""} />
        </div>

        {isEKmember && (
          <Button className="mt-6" onClick={() => redirect("/about/edit")}>
            {pageContent ? "Szerkesztés" : "Új tartalom"}
          </Button>
        )}
      </div>

      {/* Members section - full width for more cards */}
      <h2 className="mt-12 mb-4 text-2xl font-bold text-black dark:text-white">
        Körtagok
      </h2>
      <div className="w-full">
        <Members />
      </div>
    </div>
  );
}
