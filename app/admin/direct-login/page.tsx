import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function DirectLogin({
  searchParams,
}: {
  searchParams: { password?: string; returnUrl?: string }
}) {
  const { password, returnUrl = "/admin/waitlist" } = searchParams
  const adminPassword = process.env.ADMIN_PASSWORD

  // If no password provided, show the form
  if (!password) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Enter your admin password to continue</p>
          </div>
          <form className="mt-8 space-y-6" method="get">
            <input type="hidden" name="returnUrl" value={returnUrl} />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Admin password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Check if password is correct
  if (password === adminPassword) {
    // Set the auth cookie
    cookies().set({
      name: "admin_auth",
      value: adminPassword,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    })

    // Redirect to the return URL
    redirect(returnUrl)
  }

  // If password is incorrect, show error
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Invalid Password</h2>
          <p className="mt-2 text-center text-sm text-gray-600">The password you entered is incorrect.</p>
          <div className="mt-5 text-center">
            <a
              href={`/admin/direct-login?returnUrl=${encodeURIComponent(returnUrl)}`}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Try Again
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

