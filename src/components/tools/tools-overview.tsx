"use client";

import { api } from "~/trpc/react";

import ToolItem from "./tool-item";
import EditItemModal from "../inventory/EditItemModal";
import { useMemo, useState } from "react";
import { Session, Tool } from "@prisma/client";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export default function ToolsOverview({ session }: { session: any }) {
  const { data: tools, error, isLoading } = api.tools.getAll.useQuery();
  const [selectedTool, setSelectedTool] = useState<null | Tool>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const openEditModal = (tool: Tool) => {
    setSelectedTool(tool);
    setIsEditModalOpen(true);
  };
  const isAdmin = session && session.user && session.user.role === "EK_MEMBER";
  const [availableTools, unavailableTools] = useMemo(() => {
    const available: Tool[] = [];
    const unavailable: Tool[] = [];
    tools?.forEach((tool) => {
      if (tool.rentable) {
        available.push(tool);
      } else {
        unavailable.push(tool);
      }
    });
    return [available, unavailable];
  }, [tools]);

  return (
    <div className="p-4">
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {isAdmin && (
        <div className="mb-4 flex items-center justify-end">
          <Button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center"
          >
            <Plus className="mr-2" />
            Edény hozzáadása
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-4 md:grid md:grid-cols-4">
        {availableTools.map((tool) => (
          <ToolItem
            key={tool.id}
            tool={tool}
            isAdmin={isAdmin}
            onEdit={() => openEditModal(tool)}
          />
        ))}
      </div>
      {unavailableTools.length > 0 && (
        <div>
          <h2 className="mt-8 mb-4 text-2xl font-bold text-black dark:text-white">
            Nem bérelhető eszközök
          </h2>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-4">
            {unavailableTools.map((tool) => (
              <ToolItem
                key={tool.id}
                tool={tool}
                isAdmin={isAdmin}
                onEdit={() => openEditModal(tool)}
              />
            ))}
          </div>
        </div>
      )}
      <EditItemModal
        isOpen={isEditModalOpen}
        close={() => setIsEditModalOpen(false)}
        selectedTool={selectedTool}
      />
    </div>
  );
}
