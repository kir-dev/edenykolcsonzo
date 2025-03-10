import { redirect } from "next/navigation";

import RentalRequestsClient from "~/components/dashboard/RentingRequestsClient";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const RentalRequestsPage = async () => {
  api.rentals.get.prefetch();
  const session = await getServerAuthSession();

  if (!session || !session.user) {
    redirect("/login");
  }
  return <RentalRequestsClient />;
};

export default RentalRequestsPage;
