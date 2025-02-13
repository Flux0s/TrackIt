import Link from "next/link";
import { auth } from "@server/auth";
import { Button } from "@ui/button";
import { CircleCheckBig } from "lucide-react";
import { ThemeSwitcher } from "@components/top-bar/theme-switcher";
import UserMenu from "@components/top-bar/user-menu";
import Navigation from "@components/top-bar/navigation";
import { DatePicker } from "@components/lib/DatePicker";
import { Separator } from "@components/ui/separator";

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
    <div className="sticky top-0 flex justify-between bg-slate-300 px-4 py-2 dark:bg-slate-900">
      <div className="flex items-center justify-start gap-2">
        <Link href="/">
          <Button
            variant={"ghost"}
            className="gap-0 px-1 text-xl hover:bg-transparent"
          >
            {"TrackIt"}
            <CircleCheckBig size={16} strokeWidth={3} />
          </Button>
        </Link>

        {session ? (
          <>
            <Separator orientation="vertical" className="h-6" />
            <Navigation />
          </>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <DatePicker />
        <Separator orientation="vertical" className="h-6" />
        <ThemeSwitcher />
        {session ? (
          <UserMenu
            username={session?.user?.name || session?.user?.email || undefined}
            email={session?.user?.email || undefined}
            image={session?.user?.image || undefined}
          />
        ) : (
          <LoginButton />
        )}
      </div>
    </div>
  );
}
