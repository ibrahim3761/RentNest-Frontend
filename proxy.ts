import { cookies } from "next/headers";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import { jwtUtils } from "./utils/jwt";
import { getNewAccessToken } from "./service/refreshToken";

const AUTH_ROUTES = ["/login", "/register"];

const PUBLIC_ROUTES = [
  "/",
  "/about-us",
  "/properties",
  "/contact",
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const cookieStore = await cookies();

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      )
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      )
    : null;

  /**
   * Refresh Access Token
   */
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();

    if (result.success) {
      const newAccessToken = result.data.accessToken;

      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      });

      accessToken = newAccessToken;

      decodedAccessToken = jwtUtils.verifyToken(
        newAccessToken,
        process.env.JWT_ACCESS_SECRET as string
      );
    }
  }

  /**
   * Invalid Token
   */
  if (!decodedAccessToken?.success) {
    cookieStore.delete("accessToken");
  }

  /**
   * Get User Role
   */
  let userRole: string | null = null;

  if (decodedAccessToken?.success) {
    userRole = (decodedAccessToken.data as JwtPayload).role;
  }

  /**
   * Logged-in user shouldn't visit Login/Register
   */
  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    switch (userRole) {
      case "TENANT":
        return NextResponse.redirect(new URL("/dashboard", request.url));

      case "LANDLORD":
        return NextResponse.redirect(
          new URL("/landlord-dashboard", request.url)
        );

      case "ADMIN":
        return NextResponse.redirect(
          new URL("/admin-dashboard", request.url)
        );

      default:
        return NextResponse.redirect(new URL("/", request.url));
    }
  }

  /**
   * Public Route Check
   */
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  /**
   * Protected Route Check
   */
  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set(
      "redirectTo",
      pathname + request.nextUrl.search
    );

    return NextResponse.redirect(loginUrl);
  }

  /**
   * Role Based Authorization
   */

  if (
    pathname.startsWith("/dashboard") &&
    userRole !== "TENANT"
  ) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  if (
    pathname.startsWith("/landlord-dashboard") &&
    userRole !== "LANDLORD"
  ) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  if (
    pathname.startsWith("/admin-dashboard") &&
    userRole !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};