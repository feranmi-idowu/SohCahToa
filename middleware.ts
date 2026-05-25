import { NextRequest, NextResponse,  } from "next/server"

export async function middleware(request: NextRequest) {

  const accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value
  const expiresAt = request.cookies.get("expires_at")?.value
  const isExpired = Date.now() > Number(expiresAt ?? 0)

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard")
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  if (accessToken && !isExpired) {
    return NextResponse.next()
  }

  if (refreshToken) {
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

      if (refreshResponse.ok) {
        const data = await refreshResponse.json()
        const response = NextResponse.next()

        const newExpiresAt = Date.now() + 120 * 1000

        response.cookies.set("accessToken", data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 120,
          path: "/",
        })

        response.cookies.set("expires_at", newExpiresAt.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        })

        return response
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
    }
  }

  const response = NextResponse.redirect(
    new URL("/login", request.url)
  )

  response.cookies.delete("accessToken")
  response.cookies.delete("refreshToken")
  response.cookies.delete("expires_at")

  return response
}

export const config = {
  matcher: ["/dashboard/:path*"],
}