"use client";

import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

import { api } from "~/trpc/react"; // client-side TRPC hook

import { Button } from "../ui/button";
import Markdown from "../common/markdown";

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
    <div className="mx-auto flex max-w-2xl flex-col items-center p-6">
      <h1 className="mb-6 text-center text-4xl font-semibold">Rólunk</h1>

      <div className="prose text-center text-lg">
        <Markdown content={pageContent?.content ?? ""} />
      </div>

      {isEKmember && (
        <Button className="mt-6" onClick={() => redirect("/about/edit")}>
          {pageContent ? "Szerkesztés" : "Új tartalom"}
        </Button>
      )}
    </div>
  );
}
