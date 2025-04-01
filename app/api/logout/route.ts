import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  // Clear the admin auth cookie
  cookies().delete("admin_auth")

  // Redirect to the admin index page
  return NextResponse.redirect(new URL("/", request.url))
}

