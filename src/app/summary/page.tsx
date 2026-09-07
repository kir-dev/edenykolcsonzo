import { redirect } from "next/navigation";

import MemberSummaryList from "~/components/dashboard/MemberSummaryList";
import { isAdminRole } from "~/lib/utils";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

const SummaryPage = async () => {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (!isAdminRole(session.user.role)) {
    redirect("/");
  }

  // eslint-disable-next-line no-void
  void api.users.getMemberStats.prefetch();

  return (
    <HydrateClient>
      <MemberSummaryList />
    </HydrateClient>
  );
};

export default SummaryPage;
