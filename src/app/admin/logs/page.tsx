import { redirect } from "next/navigation";

import AuditLogList from "~/components/admin/AuditLogList";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const AdminLogsPage = async () => {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  // eslint-disable-next-line no-void
  void api.auditLog.list.prefetch();

  return <AuditLogList />;
};

export default AdminLogsPage;
