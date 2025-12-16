import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";

import MobileNav from "./mobile-nav";
import NavItem from "./nav-item";
import { ThemeToggleButton } from "./theme-toggle-button";

const navItems = [
  { href: "/renting", title: "Bérlés" },
  { href: "/about", title: "Rólunk" },
];

export default async function Navbar() {
  const session = await getServerAuthSession();
  const isLoggedIn = Boolean(session && session.user);
  const isAdmin = isLoggedIn && session?.user?.role === "EK_MEMBER";

  return (
    <nav className="relative flex items-center justify-between px-4 py-4">
      <Link href="/">
        <h1>Edénykölcsönző</h1>
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden gap-2 md:flex">
        {isLoggedIn ? (
          <li>
            <NavItem href="/profile" title={session?.user?.name ?? "Profil"} />
          </li>
        ) : (
          <li>
            <NavItem href="/login" title="Bejelentkezés" />
          </li>
        )}
        {isAdmin && <NavItem href="/dashboard" title="Kérés Kezelő" />}
        {navItems.map((item) => (
          <li key={item.href}>
            <NavItem href={item.href} title={item.title} />
          </li>
        ))}
        <ThemeToggleButton />
      </ul>

      {/* Mobile Navigation */}
      <div className="flex items-center gap-2 md:hidden">
        <ThemeToggleButton />
        <MobileNav
          items={navItems}
          userName={session?.user?.name ?? undefined}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
        />
      </div>
    </nav>
  );
}
