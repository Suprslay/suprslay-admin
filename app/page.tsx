import Link from "next/link"
import Image from "next/image"

export default function AdminIndex() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="relative w-[150px] h-[38px] mx-auto mb-6">
          <Image src="/images/logo.png" alt="Suprslay" fill style={{ objectFit: "contain" }} priority />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Suprslay Admin Portal</h1>
        <p className="text-lg text-gray-600">Please log in to access the admin features</p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 bg-[#e43d12] text-white">
          <h2 className="text-xl font-semibold">Admin Access Required</h2>
          <p className="mt-1 opacity-90">You need to be logged in to access admin features</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              This area is restricted to authorized administrators only. Please log in to access the following features:
            </p>

            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Waitlist management</li>
              <li>Media uploads</li>
              <li>Site configuration</li>
              <li>User analytics</li>
            </ul>

            <div className="pt-4">
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-[#e43d12] text-white font-medium rounded-lg hover:bg-[#e43d12]/90 transition-colors"
              >
                Log In to Admin
              </Link>

              <Link
                href="https://suprslay.vercel.app"
                className="inline-block ml-4 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Return to Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>If you need access to the admin area, please contact the site administrator.</p>
      </div>
    </div>
  )
}

