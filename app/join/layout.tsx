import type React from "react"

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main className="fixed inset-0 w-full h-full overflow-hidden touch-none">{children}</main>
}

