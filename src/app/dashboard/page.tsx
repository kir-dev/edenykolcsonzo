import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import RentalRequestsClient from "~/components/dashboard/RentingRequestsClient";

const RentalRequestsPage = async () => {
 void api.rentals.get.prefetch();
  const session = await getServerAuthSession();

  if (!session || !session.user) {
    redirect("/login");
  }
  return <RentalRequestsClient />;
};

export default RentalRequestsPage;