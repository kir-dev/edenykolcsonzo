"use client";

//import { useQueryClient } from "@tanstack/react-query";

import { api } from "~/trpc/react"; // client-side TRPC hook

export default function PageContent() {
  //const queryClient = useQueryClient();
  const { data: content } = api.pageContent.get.useQuery("ABOUT");

  const updatePageContentMutation = api.pageContent.update.useMutation();
  const createPageContentMutation = api.pageContent.create.useMutation();
  const handlePageConentUpdate = (newContent: string) => {
    updatePageContentMutation.mutate({
      content: newContent,
      pageType: "ABOUT",
    });
  };
  const handlePageConentCreate = (newContent: string) => {
    createPageContentMutation.mutate({
      content: newContent,
      pageType: "ABOUT",
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-4 text-4xl">Rólunk</h1>
      <p>{content ? content.content : "Loading..."}</p>
      {content ? (
        <button
          onClick={() => handlePageConentUpdate("Updated content")}
          className="mt-4"
        >
          Update content
        </button>
      ) : (
        // If there is no content, show the create button
        <button
          onClick={() => handlePageConentCreate("New content")}
          className="mt-4"
        >
          Create content
        </button>
      )}
    </div>
  );
}
