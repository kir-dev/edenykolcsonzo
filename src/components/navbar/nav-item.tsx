import Link from "next/link";

import { Button } from "../ui/button";

interface NavItemProps {
  href: string;
  title: string;
}

export default function NavItem({ href, title }: NavItemProps) {
  return (
    <Button asChild>
      <Link href={href}>{title}</Link>
    </Button>
  );
}
