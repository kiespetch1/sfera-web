import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export default auth(req => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
  const isPublicPage = req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/api/auth")

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/profile", req.url))
  }

  if (!isLoggedIn && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  return NextResponse.next()
})

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"] }
