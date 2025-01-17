"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@ui/button";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <Link href="/habits">
      <Button
        variant="ghost"
        className={`rounded-full px-2 ${pathname === "/habits" ? "text-md underline underline-offset-4" : ""}`}
      >
        Habits
      </Button>
    </Link>
  );
}
