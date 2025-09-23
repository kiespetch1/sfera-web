import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isOnProfilePage = req.nextUrl.pathname.startsWith("/profile")
    const isOnAuthPage = req.nextUrl.pathname.startsWith("/auth")

    // If logged in and trying to access auth pages, redirect to profile
    if (token && isOnAuthPage) {
      return NextResponse.redirect(new URL("/profile", req.url))
    }

    // If not logged in and trying to access profile, redirect to signin
    if (!token && isOnProfilePage) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true // We handle authorization in the middleware function above
    }
  }
)

export const config = {
  matcher: ["/profile/:path*", "/auth/:path*"]
}