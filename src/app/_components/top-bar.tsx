import Link from "next/link";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { auth } from "~/server/auth";

export default async function TopBar() {
  const session = await auth();
  return (
    <Toolbar
      start={
        <Link href="/">
          <Button label="TrackIt " size="large" rounded>
            <span className="pi pi-check-circle" />
          </Button>
        </Link>
      }
      center={
        <Link href="/habits">
          <div>
            <Button label="Habits" size="large" rounded />
          </div>
        </Link>
      }
      end={
        <div>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="no-underline"
          >
            <Button
              label={session ? `Sign out ${session.user?.name}` : "Sign in"}
              size="large"
              raised
              plain
            />
          </Link>
        </div>
      }
    />
  );
}
