"use client";

import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { redirect } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react"; // client-side TRPC hook

import Markdown from "../common/markdown";
import { Button } from "../ui/button";

export default function EditPageContent() {
  const queryClient = useQueryClient();
  const { data: pageContent, isLoading } =
    api.pageContent.get.useQuery("ABOUT");
  const [showPreview, setShowPreview] = useState(false);
  const [newContent, setNewContent] = useState(pageContent?.content ?? "");

  const updatePageContentMutation = api.pageContent.update.useMutation();
  const createPageContentMutation = api.pageContent.create.useMutation();
  const handlePageConentUpdate = () => {
    updatePageContentMutation.mutate({
      content: newContent,
      pageType: "ABOUT",
    });
    handleAfterMuattion();
  };
  const handlePageConentCreate = () => {
    createPageContentMutation.mutate({
      content: newContent,
      pageType: "ABOUT",
    });
    handleAfterMuattion();
  };

  const handleAfterMuattion = () => {
    const pageContentGetKey = getQueryKey(
      api.pageContent.get,
      undefined,
      "query",
    );
    // eslint-disable-next-line no-void
    void queryClient.invalidateQueries({ queryKey: pageContentGetKey });
    redirect("/about");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-4 text-4xl">Rólunk módosítása</h1>
      <Button onClick={() => setShowPreview((prev) => !prev)} className="mb-4">
        {showPreview ? "Szerkesztés" : "Előnézet"}
      </Button>
      {showPreview ? (
        <Markdown content={newContent} />
      ) : (
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="h-96 w-11/12 rounded-lg border border-gray-300 p-2"
        />
      )}
      <div className="flex gap-2">
        <Button onClick={() => redirect("/about")} className="mt-4">
          Vissza
        </Button>
        {pageContent ? (
          <Button onClick={() => handlePageConentUpdate()} className="mt-4">
            Mentés
          </Button>
        ) : (
          <Button onClick={() => handlePageConentCreate()} className="mt-4">
            Létrehozás
          </Button>
        )}
      </div>
    </div>
  );
}
