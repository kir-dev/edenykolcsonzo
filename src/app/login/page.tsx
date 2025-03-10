import { redirect } from "next/navigation";

import LoginProviderButton from "~/components/login/LoginProviderButton";
import { getServerAuthSession } from "~/server/auth";

export default async function LoginPage() {
  const session = await getServerAuthSession();
  if (session) {
    redirect("/profile");
  }
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="bg-accent flex flex-col items-center rounded-md p-8">
        <h1 className="mb-4">Jelentkezz be</h1>
        <p>Az eszközök bérléséhez kérjük jelentkezz be az oldalra</p>
        <LoginProviderButton provider="authsch">
          Bejelentkezés AuthSCH-val
        </LoginProviderButton>
      </div>
    </div>
  );
}
