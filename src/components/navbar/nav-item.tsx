import Link from "next/link";

import { cn } from "~/lib/utils";
import { Button } from "../ui/button";

interface NavItemProps {
  href: string;
  title: string;
  colorVariant?: "sky" | "yellow" | "default";
}

const colorClasses = {
  sky: "bg-sky-500 text-white hover:bg-sky-600 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90",
  yellow: "bg-amber-500 text-white hover:bg-amber-600 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90",
  default: "",
};

export default function NavItem({ href, title, colorVariant = "default" }: NavItemProps) {
  return (
    <Button asChild className={cn(colorClasses[colorVariant])}>
      <Link href={href}>{title}</Link>
    </Button>
  );
}
