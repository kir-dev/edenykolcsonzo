import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";

import NavItem from "./nav-item";
import { ThemeToggleButton } from "./theme-toggle-button";

const navItems = [
  { href: "/renting", title: "Bérlés" },
  { href: "/about", title: "Rólunk" },
];

export default async function Navbar() {
  const session = await getServerAuthSession();

  return (
    <nav className="flex items-center justify-between px-4 py-4">
      <Link href="/">
        <h1>Edénykölcsönző</h1>
      </Link>
      <ul className="flex gap-2">
        {session && session.user && (
          <li>
            <NavItem href="/profile" title={session.user.name ?? "Profil"} />
          </li>
        )}
        {session && session.user && session.user.role === "EK_MEMBER" && (
          <NavItem href="/dashboard" title="Kérés Kezelő" />
        )}
        {navItems.map((item) => (
          <li key={item.href}>
            <NavItem href={item.href} title={item.title} />
          </li>
        ))}
        <ThemeToggleButton />
      </ul>
    </nav>
  );
}
