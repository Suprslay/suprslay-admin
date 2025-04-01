"use client"

import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function MobileInteractionPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    // Only show on mobile devices and only on first visit
    if (isMobile && !localStorage.getItem("hasInteracted")) {
      // Show prompt after a short delay
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isMobile])

  const handleInteraction = () => {
    setShowPrompt(false)
    setHasInteracted(true)
    localStorage.setItem("hasInteracted", "true")

    // Create and dispatch touch and click events to help unlock audio/video
    document.dispatchEvent(new TouchEvent("touchstart"))
    document.dispatchEvent(new MouseEvent("click"))
  }

  if (!showPrompt) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80"
      onClick={handleInteraction}
    >
      <div className="text-white text-center p-6 max-w-xs">
        <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
        <p className="mb-6">Tap anywhere to enable audio and video for the full experience</p>
        <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mx-auto animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
      </div>
    </div>
  )
}

