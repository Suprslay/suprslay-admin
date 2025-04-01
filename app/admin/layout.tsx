import type React from "react"
import { cookies } from "next/headers"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated
  const isAuthenticated = cookies().has("admin_auth")

  // If not authenticated and not on the main admin page, login page, or direct login page,
  // we don't need to show the header
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/direct-login" || pathname === "/admin"

  if (!isAuthenticated && !isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Suprslay Admin</h1>
            <div className="flex space-x-4">
              <Link href="/admin/waitlist" className="text-gray-600 hover:text-gray-900">
                Waitlist
              </Link>
              <Link href="/admin/upload" className="text-gray-600 hover:text-gray-900">
                Upload
              </Link>
              <Link href="/admin/test" className="text-gray-600 hover:text-gray-900">
                Test Auth
              </Link>
              <Link href="/api/admin/logout" className="text-red-600 hover:text-red-800">
                Logout
              </Link>
            </div>
          </div>
        </header>
      )}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}

