import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {

  // get tokens from cookies
  const accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value

  // then check if route needs protection
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard")
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  //  if access token exists, let them through
  if (accessToken) {
    return NextResponse.next()
  }

  // when there is no access token, but refresh token exists then try to silently refresh
  if (!accessToken && refreshToken) {
    try {
      const refreshResponse = await fetch(
        new URL("/api/auth/refresh", request.url),
        {
          method: "POST",
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        }
      )

      // refresh succeeded then let them through
      if (refreshResponse.ok) {
        const response = NextResponse.next()
        const data = await refreshResponse.json()

        // set the new access token cookie
        response.cookies.set("accessToken", data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600,
          path: "/",
        })

        return response
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
    }
  }

  // Step 6 — Both tokens missing or refresh failed → redirect to login
  const response = NextResponse.redirect(
    new URL("/login", request.url)
  )

  // Clear any remaining cookies
  response.cookies.delete("accessToken")
  response.cookies.delete("refreshToken")

  return response
}

export const config = {
  matcher: ["/dashboard/:path*"],
}