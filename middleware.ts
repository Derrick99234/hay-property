import { NextResponse, type NextRequest } from "next/server";
import { parseSessionCookie } from "./src/app/auth/_lib/session";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const session = parseSessionCookie(req.headers.get("cookie"));

  if (pathname.startsWith("/admin")) {
    if (
      pathname === "/admin/login" ||
      pathname === "/admin/forgot-password" ||
      pathname === "/admin/reset-password"
    ) {
      return NextResponse.next();
    }
    if (session?.role === "admin") return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/account")) {
    if (session?.role === "user") return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
