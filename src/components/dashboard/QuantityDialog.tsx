"use client";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface QuantityDialogProps {
  open: boolean;
  newQuantity: number;
  setNewQuantity: (value: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

// This component renders inline (without a portal) so it can be positioned near its trigger.
export function QuantityDialog({
  open,
  newQuantity,
  setNewQuantity,
  onConfirm,
  onCancel,
}: QuantityDialogProps) {
  if (!open) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onCancel();
        }
      }}
    >
      <DialogContent className="p-5">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Mennyiség megváltoztatása</DialogTitle>
          <DialogDescription>Add meg az új mennyiséget:</DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <input
            type="number"
            value={newQuantity}
            min={0}
            onChange={(e) => setNewQuantity(Number(e.target.value))}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <DialogFooter className="flex justify-end gap-2 border-t pt-2">
          <button
            onClick={onCancel}
            className="rounded bg-gray-300 px-4 py-2 transition-all hover:bg-gray-400 dark:bg-slate-700 dark:hover:bg-slate-800"
          >
            Mégse
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            OK
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
