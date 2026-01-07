import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (pathname === "/" || pathname.startsWith("/store") || pathname.startsWith("/login") || pathname.startsWith("/register")) {
          return true;
        }

        if (pathname.startsWith("/dashboard") || pathname.startsWith("/cart") || pathname.startsWith("/orders")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/orders"],
};
