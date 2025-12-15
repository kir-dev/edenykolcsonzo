"use client";

import { api } from "~/trpc/react";

import Member from "./member";

export default function Members() {
  const { data: members, isLoading, error } = api.users.getEKMembers.useQuery();

  if (isLoading) {
    return <div className="text-center">Tagok betöltése...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Hiba: {error.message}</div>
    );
  }

  if (!members || members.length === 0) {
    return <div className="text-center italic">Még nincsenek tagok.</div>;
  }

  return (
    <div className="grid grid-flow-col grid-rows-4 gap-4 md:grid-rows-3 lg:grid-rows-2">
      {members.map((member) => (
        <Member
          key={member.id}
          name={member.fullName || member.nickname || "Ismeretlen"}
          email={member.email || ""}
          role="Tag"
          avatar={member.profileImage || ""}
        />
      ))}
    </div>
  );
}
