import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {

  const refreshToken = request.cookies.get("refreshToken")?.value

  if (!refreshToken) {
    return NextResponse.json(
      { error: "No refresh token found" },
      { status: 401 }
    )
  }

  const isValid = refreshToken.startsWith("refresh_") 

  if (!isValid) {
    const response = NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    )
    response.cookies.delete("accessToken")
    response.cookies.delete("refreshToken")
    return response
  }

  const newAccessToken = `access_refreshed_${Date.now()}`
  const response = NextResponse.json({
    accessToken: newAccessToken,
    expiresIn: 120,
  })

  response.cookies.set("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 120,
    path: "/",
  })

  return response
}