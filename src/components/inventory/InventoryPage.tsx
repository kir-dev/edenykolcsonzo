"use client";

import { Tool } from "@prisma/client";
import { Edit, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { api } from "~/trpc/react";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";

const InventoryPage: React.FC = () => {
  const {
    data: tools,
    refetch,
    error,
    isLoading,
  } = api.tools.getAll.useQuery();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm<Tool>();

  const openEditDialog = (tool: Tool) => {
    setSelectedTool(tool);
    setValue("id", tool.id);
    setValue("name", tool.name);
    setValue("description", tool.description);
    setValue("quantity", tool.quantity);
    setValue("image", tool.image);
    setValue("rentable", tool.rentable);
    setIsAddDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedTool(null);
    setIsAddDialogOpen(false);
    reset();
  };
  const updateItemsMutation = api.tools.upsertTool.useMutation({
    onSuccess: () => {
      console.log("success");
      refetch();
    },
  });

  const deleteToolMutation = api.tools.deleteTool.useMutation({
    onSuccess: () => {
      console.log("Tool deleted");
      refetch(); // Refetch the tools list after deletion
      closeDialog();
    },
  });

  const deleteTool = (id: number) => {
    deleteToolMutation.mutate(id);
    closeDialog();
  };

  const onSubmitTool = (data: Tool) => {
    console.log(data);
    data.quantity = Number(data.quantity);
    updateItemsMutation.mutate(data);
    closeDialog();
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edények</h1>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center"
        >
          <Plus className="mr-2" />
          Edény hozzáadása
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools?.map((tool) => (
          <Card key={tool.id} className="p-4">
            <CardContent className="flex flex-col gap-4">
              <img
                src={tool.image || "/villa.jpg"}
                alt={tool.name}
                className="mb-2 h-60 w-2/3 self-center rounded-lg object-cover"
              />
              <h2 className="text-xl font-semibold">{tool.name}</h2>
              <p>{tool.description}</p>
              <p>Darabszám: {tool.quantity}</p>
              <p>Bérelhető: {tool.rentable ? "Igen" : "Nem"}</p>
              <Button
                onClick={() => openEditDialog(tool)}
                className="mt-2 flex items-center"
              >
                <Edit className="mr-2" /> Módosítás
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAddDialogOpen && (
        <Dialog open onOpenChange={closeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedTool ? `${selectedTool.name} módosítása` : "Hozzáadás"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onSubmitTool)}
              className="flex flex-col gap-4"
            >
              <Input
                placeholder="Név"
                {...register("name", { required: true })}
              />
              <Input placeholder="Leírás" {...register("description")} />
              <Input
                type="number"
                placeholder="Darabszám"
                {...register("quantity", { required: true })}
              />
              <Input placeholder="Kép URL" {...register("image")} />
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("rentable")} /> Bérelhető
              </label>
              <DialogFooter className="flex justify-between">
                {selectedTool && (
                  <Button
                    variant="destructive"
                    onClick={() => selectedTool && deleteTool(selectedTool.id)}
                    className="flex items-center"
                  >
                    <Trash className="mr-2" /> Törlés
                  </Button>
                )}
                <Button type="submit">
                  {selectedTool ? "Módosítás" : "Hozzáadás"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InventoryPage;
