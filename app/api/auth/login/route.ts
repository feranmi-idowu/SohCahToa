import { NextRequest, NextResponse } from "next/server"

// users database
const USERS = [
  {
    id: "user_1",
    email: "admin@sohcahtoa.com",
    password: "admin123",
    role: "admin" as const,
  },
  {
    id: "user_2",
    email: "analyst@sohcahtoa.com",
    password: "analyst123",
    role: "analyst" as const,
  },
]

// post /api/auth/login
export async function POST(request: NextRequest) {

  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }

  // finds the user in USERS/database and make sure user-email corresponds to the user password
  const user = USERS.find(
    (u) => u.email === email && u.password === password
  )

  // and if no user found then return error
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    )
  }

  //  this generate tokens
  const accessToken = `access_${user.id}_${Date.now()}`
  const refreshToken = `refresh_${user.id}_${Date.now()}`

  //  what API returns according to what is in section 1; 1.1
  const response = NextResponse.json({
    accessToken,
    refreshToken,
    expiresIn: 120, //6minutes
    user: {
      id: user.id,
      role: user.role,
    },
  })

  // setting the token as a secure cookie
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true, // JS cannot read this — XSS protection
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // CSRF protection — cookie not sent on cross-site requests
    maxAge: 120, // 2 minutes short-lived access token enough to log in
    path: "/",
  })

  // refreshToken cookie — longer-lived
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,  // 24 hours
    path: "/",

  })

  return response
}