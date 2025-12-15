"use client";

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

  const isEKMember = userRole === "EK_MEMBER";

  return (
    <ProfileImageEditor
      currentImage={currentUser?.profileImage || null}
      userName={userName}
      isEKMember={isEKMember}
    />
  );
}
