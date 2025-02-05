import { auth } from "@server/auth";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const session = req.auth;

  console.log("Middleware Debug:", {
    path,
    hasSession: !!session,
    hasUser: !!session?.user,
    sessionData: session,
  });

  // If user is authenticated and trying to access signin page, redirect to home
  if (session?.user && path === "/api/auth/signin") {
    console.log("Redirecting to home: User already authenticated");
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});
