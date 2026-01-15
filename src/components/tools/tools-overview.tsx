"use client";

import { Tool } from "@prisma/client";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { api } from "~/trpc/react";

import EditItemModal from "../inventory/EditItemModal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ToolItem from "./tool-item";

export default function ToolsOverview({ session }: { session: any }) {
  const {
    data: tools,
    error,
    isLoading,
    refetch,
  } = api.tools.getAll.useQuery();
  const [selectedTool, setSelectedTool] = useState<null | Tool>(null);
  const [searchTerm, setSearchTerm] = useState("");
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
      if (
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        if (tool.rentable) {
          available.push(tool);
        } else {
          unavailable.push(tool);
        }
      }
    });
    return [available, unavailable];
  }, [tools, searchTerm]);

  return (
    <div className="p-4">
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="text"
          placeholder="Keresés..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-card mr-2 max-w-2xl border focus:border-blue-500 focus:ring-0 sm:mr-2 sm:max-w-md dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
        />
        {isAdmin && (
          <Button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center whitespace-nowrap"
          >
            <Plus className="mr-2" />
            Edény hozzáadása
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
          <h2 className="mt-8 mb-4 text-2xl font-bold">
            Nem bérelhető eszközök
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
        refetch={refetch}
      />
    </div>
  );
}
