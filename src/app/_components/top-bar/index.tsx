import Link from "next/link";
import { auth } from "~/server/auth";

import { Button } from "@ui/button";
import { CircleCheckBig } from "lucide-react";

function LoginButton() {
  return (
    <Link href="/api/auth/signin">
      <Button>Sign in</Button>
    </Link>
  );
}

export default async function TopBar() {
  const session = await auth();
  return (
    <div className="flex justify-between px-4 py-2">
      {
        <Link href="/">
          <Button
            variant={"ghost"}
            className="text-md gap-0 px-1 hover:bg-transparent"
          >
            {"TrackIt"}
            <CircleCheckBig size={16} />
          </Button>
        </Link>
      }

      {session ? (
        <Link href="/habits">
          <button>Habits</button>
        </Link>
      ) : null}
      {session ? (
        <div></div>
      ) : (
        // <UserMenu
        //   username={session?.user?.name || session?.user?.email || undefined}
        //   image={session?.user?.image || undefined}
        // />
        <LoginButton />
      )}
    </div>
  );
}
