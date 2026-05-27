import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {

  const token =
    request.cookies.get("token")?.value;

  const { pathname } =
    request.nextUrl;

  // Allow login and registration pages
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/registration"
  ) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (
    pathname.startsWith("/admin") &&
    !token
  ) {
    return NextResponse.redirect(
      new URL(
        "/admin/login",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};