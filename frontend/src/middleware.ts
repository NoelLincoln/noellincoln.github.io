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
