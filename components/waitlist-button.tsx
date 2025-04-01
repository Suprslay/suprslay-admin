"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface PerspectiveWaitlistProps {
  active: boolean
}

export default function PerspectiveWaitlist({ active }: PerspectiveWaitlistProps) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (active && !isVisible) {
      // Add a small delay before showing
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [active, isVisible])

  // If not active and never been visible, don't render
  if (!active && !isVisible) return null

  const handleClick = () => {
    router.push("/join")
  }

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      {/* Slide-in animation container */}
      <motion.div
        initial={{ y: "100%" }}
        animate={
          isVisible
            ? {
                y: "0%",
                transition: {
                  type: "spring",
                  stiffness: 40,
                  damping: 20,
                  delay: 0.2,
                },
              }
            : {}
        }
        className="absolute bottom-0 left-0 w-full flex justify-center"
      >
        {/* Simple skewed text for a clean perspective effect */}
        <div
          onClick={handleClick}
          className="text-center uppercase cursor-pointer"
          style={{
            color: "#E43D12",
            fontSize: "clamp(4rem, 12vw, 9rem)",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            transform: "perspective(400px) rotateX(15deg)",
            transformOrigin: "center bottom",
            marginBottom: "0",
            paddingBottom: "0",
            lineHeight: "0.9",
          }}
        >
          JOIN WAITLIST
        </div>
      </motion.div>
    </div>
  )
}

