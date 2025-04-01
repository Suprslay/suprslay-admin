import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define the admin password from environment variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

// Function to check if a route should be protected
function isProtectedRoute(pathname: string): boolean {
  // Protect all routes except the index and login pages
  return pathname !== "/" && pathname !== "/login" && !pathname.startsWith("/login/")
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for non-protected routes
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  const authCookie = request.cookies.get("admin_auth")?.value

  if (!authCookie || authCookie !== ADMIN_PASSWORD) {
    // Redirect to login page with return URL
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("returnUrl", encodeURIComponent(pathname))
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Configure the middleware to run on all routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

