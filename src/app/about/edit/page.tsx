import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

import EditPageContent from "~/components/pageContent/EditPageContent";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const EditPage = async () => {
  // eslint-disable-next-line no-void
  void api.pageContent.get.prefetch("ABOUT");
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  const isEKmember = session.user.role === Role.EK_MEMBER;

  if (!isEKmember) {
    redirect("/about");
  }

  return <EditPageContent />;
};

export default EditPage;
