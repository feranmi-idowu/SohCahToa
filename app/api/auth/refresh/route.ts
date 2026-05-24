import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {

  // this gets the refresh token from cookies
  const refreshToken = request.cookies.get("refreshToken")?.value

  // if no refresh token exists, force logout
  if (!refreshToken) {
    return NextResponse.json(
      { error: "No refresh token found" },
      { status: 401 }
    )
  }

  // simulate token validation
  const isValid = refreshToken.startsWith("refresh_") // in a real app this will be validated against a database

  if (!isValid) {
    // clear cookies and force logout
    const response = NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    )
    response.cookies.delete("accessToken")
    response.cookies.delete("refreshToken")
    return response
  }

  // issue new tokens
  const newAccessToken = `access_refreshed_${Date.now()}`

  const response = NextResponse.json({
    accessToken: newAccessToken,
    expiresIn: 120,
  })

  // sets new cookie
  response.cookies.set("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 120,
    path: "/",
  })

  return response
}