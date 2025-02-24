import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="mb-4">Jelentkezz be</h1>
      <p>Az eszközök bérléséhez kérjük jelentkezz be az oldalra</p>
      <Link href="/api/auth/signin" className="mt-4 rounded bg-blue-500 p-2">
        Bejelentkezés AuthSCH segítségével
      </Link>
    </div>
  );
}
