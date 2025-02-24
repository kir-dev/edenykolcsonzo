import { redirect } from "next/navigation";
import StartRentalForm from "~/components/rental/start-rental-form";
import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function RentingPage() {
  const session = await getServerAuthSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col items-center justify-center">
        <h1 className="">Kölcsönzés</h1>
        <div className="container mx-auto px-8 py-10">
          <StartRentalForm />
        </div>
      </main>
    </HydrateClient>
  );
}
