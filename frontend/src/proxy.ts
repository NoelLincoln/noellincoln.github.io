// Proxy (formerly the `middleware` convention, renamed in Next 16) — guards the
// authenticated blog routes, redirecting signed-out visitors to /login. The
// NextAuth `auth()` wrapper is the single default export the proxy file expects.
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const protectedPaths = ["/blog/create", "/blog/categories"];
  const isProtected = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));

  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/blog/create", "/blog/categories"],
};
