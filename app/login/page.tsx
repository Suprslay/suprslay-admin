"use client"

import { useState, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("returnUrl") || "/waitlist"

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Redirect to the return URL or admin dashboard
        router.push(decodeURIComponent(returnUrl))
      } else {
        setError(data.message || "Invalid password")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-gray-50">
      {/* Header with logo */}
      <div className="fixed top-6 left-0 right-0 text-center z-10">
        <Link href="/">
          <div className="relative w-[120px] h-[30px] mx-auto">
            <Image src="/images/logo.png" alt="Suprslay" fill style={{ objectFit: "contain" }} priority />
          </div>
        </Link>
      </div>

      {/* Main content */}
      <div className="fixed inset-0 flex items-center justify-center z-20 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Card header */}
            <div className="p-6 text-white" style={{ backgroundColor: "#e43d12" }}>
              <h2 className="text-2xl font-bold">Admin Login</h2>
              <p className="opacity-90 mt-1">Enter your admin password to continue</p>
            </div>

            {/* Card content */}
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="shimmer-input-wrapper">
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e43d12] bg-white"
                      placeholder="Enter admin password"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full px-6 py-2 rounded-lg text-white transition-all ${
                      isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
                    }`}
                    style={{ backgroundColor: "#e43d12" }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Logging in...
                      </span>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <Link href="https://suprslay.vercel.app" className="text-sm text-gray-500 hover:text-[#e43d12]">
                  Return to Main Site
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

