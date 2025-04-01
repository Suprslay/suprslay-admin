import type React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
  title: "Suprslay Admin",
  description: "Admin panel for Suprslay",
  viewport: "width=device-width, initial-scale=1.0",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated
  const isAuthenticated = cookies().has("admin_auth")

  // If not authenticated and not on the main admin page or login page,
  // we don't need to show the header
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  const isLoginPage = pathname === "/login" || pathname === "/"

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {isAuthenticated && (
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900">Suprslay Admin</h1>
              <div className="flex space-x-4">
                <Link href="/waitlist" className="text-gray-600 hover:text-gray-900">
                  Waitlist
                </Link>
                <Link href="/upload" className="text-gray-600 hover:text-gray-900">
                  Upload
                </Link>
                <Link href="/media" className="text-gray-600 hover:text-gray-900">
                  Media
                </Link>
                <Link href="/test" className="text-gray-600 hover:text-gray-900">
                  Test Auth
                </Link>
                <Link href="/api/logout" className="text-red-600 hover:text-red-800">
                  Logout
                </Link>
              </div>
            </div>
          </header>
        )}
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </body>
    </html>
  )
}



import './globals.css'