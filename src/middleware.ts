import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth(req => {
  const isLoggedIn = !!req.auth
  const isOnProfilePage = req.nextUrl.pathname.startsWith("/profile")
  const isOnAuthPage = req.nextUrl.pathname.startsWith("/auth")

  if (isLoggedIn && isOnAuthPage) {
    return NextResponse.redirect(new URL("/profile", req.url))
  }

  if (!isLoggedIn && isOnProfilePage) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  return NextResponse.next()
})

export const config = { matcher: ["/profile/:path*", "/auth/:path*"] }
