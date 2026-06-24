import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifySessionToken(token))) {
    const loginUrl = new URL("/admin", req.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/api/admin/services/:path*",
    "/api/admin/projects/:path*",
    "/api/admin/settings/:path*",
    "/api/admin/stats/:path*",
    "/api/admin/testimonials/:path*",
    "/api/admin/process/:path*",
  ],
};
