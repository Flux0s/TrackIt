"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function UserMenu({
  username,
  image,
}: {
  username?: string;
  image?: string;
}) {
  const usermenu = useRef<Menu | null>(null);
  const router = useRouter();

  return (
    <div>
      <Menu
        popup
        model={[
          {
            label: "Sign Out",
            icon: "pi pi-sign-out",
            command: () => {
              router.push("/api/auth/signout");
            },
          },
        ]}
        ref={usermenu}
      />
      <Button
        label={`${username || "User"}`}
        onClick={(event) => usermenu.current?.toggle(event)}
      >
        <Avatar
          className="ms-2"
          shape="circle"
          icon="pi pi-user"
          label={username?.charAt(0)?.toUpperCase()}
          image={image}
        />
      </Button>
    </div>
  );
}
