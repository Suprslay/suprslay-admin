import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Get the admin password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      console.error("Admin password not configured on server")
      return NextResponse.json({ success: false, message: "Admin password not configured on server" }, { status: 500 })
    }

    // Check if the password matches
    if (password === adminPassword) {
      // Set a cookie for authentication
      const cookieStore = cookies()

      cookieStore.set({
        name: "admin_auth",
        value: adminPassword,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Changed from 'strict' to 'lax' for better compatibility
        path: "/",
        // Set expiration to 24 hours
        maxAge: 60 * 60 * 24,
      })

      console.log("Login successful, cookie set")

      return NextResponse.json({
        success: true,
        message: "Login successful",
      })
    } else {
      console.log("Invalid password attempt")
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "An error occurred during login" }, { status: 500 })
  }
}

