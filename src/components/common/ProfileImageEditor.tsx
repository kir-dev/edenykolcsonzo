"use client";

import { Camera } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

interface ProfileImageEditorProps {
  currentImage: string | null;
  userName: string;
  isEKMember: boolean;
}

export default function ProfileImageEditor({
  currentImage,
  userName,
  isEKMember,
}: ProfileImageEditorProps) {
  const [imageUrl, setImageUrl] = useState(currentImage || "");
  const [isEditing, setIsEditing] = useState(false);

  const utils = api.useUtils();

  const updateImageMutation = api.users.updateProfileImage.useMutation({
    onSuccess: () => {
      toast.success("Profilkép sikeresen frissítve!");
      setIsEditing(false);
      utils.users.getCurrentUser.invalidate();
      utils.users.getEKMembers.invalidate();
    },
    onError: (error) => {
      toast.error(`Hiba: ${error.message}`);
    },
  });

  const handleSave = () => {
    updateImageMutation.mutate({
      profileImage: imageUrl.trim() || null,
    });
  };

  const handleCancel = () => {
    setImageUrl(currentImage || "");
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={imageUrl || undefined} alt={userName} />
        <AvatarFallback className="text-2xl">
          {userName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {isEKMember &&
        (isEditing ? (
          <div className="flex w-full max-w-sm flex-col gap-2">
            <Input
              type="url"
              placeholder="Kép URL (pl. https://i.imgur.com/xyz.jpg)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-white text-black dark:bg-gray-700 dark:text-white"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={updateImageMutation.isPending}
                className="flex-1"
              >
                {updateImageMutation.isPending ? "Mentés..." : "Mentés"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                Mégse
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            Profilkép módosítása
          </Button>
        ))}
    </div>
  );
}
