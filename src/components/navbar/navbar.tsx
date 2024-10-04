import Link from "next/link";
import NavItem from "./nav-item";
import { ThemeToggleButton } from "./theme-toggle-button";

const navItems = [
  { href: "/renting", title: "Bérlés" },
  { href: "/about", title: "Rólunk" },
];

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-2">
      <Link href="/">
        <h1>Edénykölcsönző</h1>
      </Link>
      <ul className="flex gap-2">
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
