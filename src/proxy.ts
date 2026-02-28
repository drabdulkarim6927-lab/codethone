import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedRoutes = ["/compete", "/dashboard"];
  const adminRoutes = ["/dashboard"];

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = verifyToken(token);

  if (!user) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("token");
    return res;
  }

  if (!user.isVerified) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (adminRoutes.some((r) => pathname.startsWith(r))) {
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/compete/:path*", "/dashboard/:path*"],
};
