import { redirect } from "next/navigation";

import EditPageContent from "~/components/pageContent/EditPageContent";
import { isAdminRole } from "~/lib/utils";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const EditPage = async () => {
  // eslint-disable-next-line no-void
  void api.pageContent.get.prefetch("ABOUT");
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  const isEKmember = isAdminRole(session.user.role);

  if (!isEKmember) {
    redirect("/about");
  }

  return <EditPageContent />;
};

export default EditPage;
