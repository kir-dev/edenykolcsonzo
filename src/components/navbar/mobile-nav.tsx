"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "../ui/button";

interface MobileNavProps {
  items: { href: string; title: string }[];
  userName?: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

export default function MobileNav({
  items,
  userName,
  isLoggedIn,
  isAdmin,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="bg-background absolute top-16 right-0 left-0 z-50 border-b p-4 shadow-lg">
          <nav className="flex flex-col gap-2">
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="hover:bg-accent rounded-md px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                {userName ?? "Profil"}
              </Link>
            ) : (
              <Link
                href="/login"
                className="hover:bg-accent rounded-md px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Bejelentkezés
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/dashboard"
                className="hover:bg-accent rounded-md px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Kérés Kezelő
              </Link>
            )}
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:bg-accent rounded-md px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
