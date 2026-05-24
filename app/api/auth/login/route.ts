import { NextRequest, NextResponse } from "next/server"


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

export async function POST(request: NextRequest) {

  const body = await request.json()
  const { email, password } = body
  const expiresAt = Date.now() + 60 * 1000;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }

  
  const user = USERS.find(
    (u) => u.email === email && u.password === password
  )

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    )
  }


  const accessToken = `access_${user.id}_${Date.now()}`
  const refreshToken = `refresh_${user.id}_${Date.now()}`

  const response = NextResponse.json({
    accessToken,
    refreshToken,
    expiresIn: 120,
    user: {
      id: user.id,
      role: user.role,
    },
  })

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", 
    maxAge: 120, 
    path: "/",
  })

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 360,  
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