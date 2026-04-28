import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { AUTH_COOKIE, verifyToken } from "./lib/auth-shared";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(AUTH_COOKIE)?.value;
    const session = await verifyToken(token);
    const authed = session !== null;

    if (pathname !== "/admin/login" && !authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    if (pathname === "/admin/login" && authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
