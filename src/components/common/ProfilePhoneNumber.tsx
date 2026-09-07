"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export default function ProfilePhoneNumber() {
  const utils = api.useUtils();
  const { data: currentUser } = api.users.getCurrentUser.useQuery();
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    setPhoneNumber(currentUser?.phoneNumber ?? "");
  }, [currentUser?.phoneNumber]);

  const updatePhoneNumberMutation = api.users.updatePhoneNumber.useMutation({
    onSuccess: () => {
      toast.success("Telefonszám elmentve!");
      utils.users.getCurrentUser.invalidate();
    },
    onError: (error) => {
      toast.error(`Hiba történt: ${error.message}`);
    },
  });

  const isChanged = phoneNumber !== (currentUser?.phoneNumber ?? "");

  return (
    <div className="flex flex-row items-center p-1.5 py-0.5">
      <b className="mr-2">Telefonszám: </b>
      <Input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Pl. +36 30 123 4567"
        className="w-48"
      />
      {isChanged && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-2"
          disabled={updatePhoneNumberMutation.isPending}
          onClick={() =>
            updatePhoneNumberMutation.mutate({
              phoneNumber: phoneNumber || null,
            })
          }
        >
          Mentés
        </Button>
      )}
    </div>
  );
}
