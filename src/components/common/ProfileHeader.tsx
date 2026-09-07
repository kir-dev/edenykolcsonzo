"use client";

import { isAdminRole } from "~/lib/utils";
import { api } from "~/trpc/react";

import ProfileImageEditor from "./ProfileImageEditor";

interface ProfileHeaderProps {
  userName: string;
  userRole: string;
}

export default function ProfileHeader({
  userName,
  userRole,
}: ProfileHeaderProps) {
  const { data: currentUser } = api.users.getCurrentUser.useQuery();

  const isEKMember = isAdminRole(userRole);

  return (
    <ProfileImageEditor
      currentImage={currentUser?.profileImage || null}
      userName={userName}
      isEKMember={isEKMember}
    />
  );
}
