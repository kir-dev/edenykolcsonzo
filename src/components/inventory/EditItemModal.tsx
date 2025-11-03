"use client";

import { Tool } from "@prisma/client";
import { Trash } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { api } from "~/trpc/react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";

export default function EditItemModal({
  selectedTool,
  isOpen,
  close,
  refetch,
}: {
  selectedTool: Tool | null;
  isOpen: boolean;
  close: () => void;
  refetch: () => void;
}) {
  const { register, handleSubmit, reset, setValue } = useForm<Tool>();
  useEffect(() => {
    if (selectedTool) {
      setValue("id", selectedTool.id);
      setValue("name", selectedTool.name);
      setValue("description", selectedTool.description);
      setValue("quantity", selectedTool.quantity);
      setValue("image", selectedTool.image);
      setValue("rentable", selectedTool.rentable);
    } else {
      reset();
    }
  }, [selectedTool, setValue]);
  const updateItemsMutation = api.tools.upsertTool.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const deleteToolMutation = api.tools.deleteTool.useMutation({
    onSuccess: () => {
      refetch(); // Refetch the tools list after deletion
      close();
    },
  });

  const onSubmitTool = (data: Tool) => {
    data.quantity = Number(data.quantity);
    updateItemsMutation.mutate(data);
    close();
  };
  const deleteTool = (id: number) => {
    deleteToolMutation.mutate(id);
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
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
          <Input placeholder="Név" {...register("name", { required: true })} />
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
  );
}
