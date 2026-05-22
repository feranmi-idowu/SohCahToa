import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
 
  const accessToken = request.cookies.get("accessToken") // accessToken cookie

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard") // check if user is trying to access dashboard

  // if protected route and no token → redirect to login
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// the routes this middleware applies to
export const config = {
  matcher: ["/dashboard/:path*"],
}