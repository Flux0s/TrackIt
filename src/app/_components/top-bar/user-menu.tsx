"use client";
import { useRouter } from "next/navigation";
import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { LogOut } from "lucide-react";

export default function UserMenu({
  username,
  email,
  image,
}: {
  username?: string;
  email?: string;
  image?: string;
}) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-1">
          {username || email || "User"}
          <Avatar className="h-8 w-8">
            <AvatarImage src={image} alt={username || "User avatar"} />
            <AvatarFallback>
              {username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push("/api/auth/signout")}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
