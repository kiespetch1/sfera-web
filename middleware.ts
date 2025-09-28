import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
    const isPublicPage =
      req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/api/auth")

    if (req.nextauth.token && isAuthPage) {
      return NextResponse.redirect(new URL("/profile", req.url))
    }

    if (!req.nextauth.token && !isAuthPage && !isPublicPage) {
      const url = new URL("/auth/signin", req.url)
      url.searchParams.set("callbackUrl", req.nextUrl.pathname)
      url.searchParams.set("error", "AuthRequired")
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        return true
      },
    },
    pages: { signIn: "/auth/signin" },
  }
)

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"] }
