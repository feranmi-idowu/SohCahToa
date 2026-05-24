import { NextRequest, NextResponse,  } from "next/server"
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {

  const accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value
  const expiresAt = Date.now() + 60 * 1000;
  request.cookies.get("expires_at")?.value;
  const isExpired = Date.now() > Number(expiresAt);

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard")
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  if (accessToken) {
    return NextResponse.next()
  }

  
if (!accessToken || !expiresAt) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }


  if (isExpired) {
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
        const response = NextResponse.next()
        const data = await refreshResponse.json()

        response.cookies.set("accessToken", data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600,
          path: "/",
        })

        response.cookies.set("expires_at", expiresAt.toString(), {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/",
        });

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

  return response
}

export const config = {
  matcher: ["/dashboard/:path*"],
}