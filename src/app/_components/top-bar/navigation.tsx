"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@ui/button";
import { cn } from "@lib/utils";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
          "h-auto flex-row rounded-lg px-2 py-1",
          pathname === href ? "underline underline-offset-4" : "",
        )}
      >
        {children}
      </Button>
    </Link>
  );
}

export default function Navigation() {
  return (
    <div className="flex items-start gap-2">
      <NavLink href="/habits">Habits</NavLink>
      <NavLink href="/review">Review</NavLink>
    </div>
  );
}
