"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { RECTANGLE_REVEAL_DURATION } from "@/constants/animation-constants"

interface MobileSlidingTextProps {
  active: boolean
  loopCount: number
  revealActive: boolean
}

export default function MobileSlidingText({ active, loopCount, revealActive }: MobileSlidingTextProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const animationStartedRef = useRef(false)
  const exitAnimationStartedRef = useRef(false)

  // Reset state when component mounts or loopCount changes
  useEffect(() => {
    console.log("Mobile sliding text reset, loop:", loopCount)
    setIsAnimating(false)
    setIsExiting(false)
    animationStartedRef.current = false
    exitAnimationStartedRef.current = false
  }, [loopCount])

  // Start the animation when active
  useEffect(() => {
    if (!active || animationStartedRef.current) return

    console.log("Starting mobile sliding text animation")
    animationStartedRef.current = true

    // Start immediately without delay since we're now triggering during collapse
    setIsAnimating(true)

    return () => {}
  }, [active])

  // Start exit animation when reveal becomes active
  useEffect(() => {
    if (!revealActive || exitAnimationStartedRef.current || !animationStartedRef.current) return

    console.log("Starting mobile sliding text exit animation")
    exitAnimationStartedRef.current = true
    setIsExiting(true)

    return () => {}
  }, [revealActive])

  if (!active) {
    return null
  }

  // Text styling
  const textStyle = {
    color: "#E43D12",
    fontSize: "clamp(0.75rem, 5vw, 1.5rem)",
    fontWeight: "bold" as const,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    whiteSpace: "nowrap" as const,
    textAlign: "center" as const,
    width: "100%",
  }

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden flex flex-col">
      {/* Top section - "Style yourself" */}
      <motion.div
        className="w-full flex items-center justify-center"
        initial={{ y: "-100%" }}
        animate={
          isAnimating
            ? {
                y: isExiting ? "-100%" : "0%", // Slide out to the top when exiting
                transition: {
                  type: isExiting ? "tween" : "spring",
                  duration: isExiting ? RECTANGLE_REVEAL_DURATION / 1000 : undefined,
                  ease: isExiting ? "easeInOut" : undefined,
                  damping: isExiting ? undefined : 20,
                  stiffness: isExiting ? undefined : 90,
                  delay: isExiting ? 0 : 0.2,
                },
              }
            : {}
        }
        style={{
          height: "15vh",
          paddingTop: "8vh", // Push text down within the container
        }}
      >
        <div
          style={{
            ...textStyle,
            paddingLeft: "15%",
            paddingRight: "15%",
          }}
        >
          Style yourself
        </div>
      </motion.div>

      {/* Middle section - This is where the images will be displayed */}
      <div className="flex-grow" />

      {/* Bottom section - "Skip the shoot" */}
      <motion.div
        className="w-full flex items-center justify-center"
        initial={{ y: "100%" }}
        animate={
          isAnimating
            ? {
                y: isExiting ? "100%" : "0%", // Slide out to the bottom when exiting
                transition: {
                  type: isExiting ? "tween" : "spring",
                  duration: isExiting ? RECTANGLE_REVEAL_DURATION / 1000 : undefined,
                  ease: isExiting ? "easeInOut" : undefined,
                  damping: isExiting ? undefined : 20,
                  stiffness: isExiting ? undefined : 90,
                  delay: isExiting ? 0 : 0.4,
                },
              }
            : {}
        }
        style={{
          height: "15vh",
          paddingBottom: "8vh", // Push text up within the container
        }}
      >
        <div
          style={{
            ...textStyle,
            paddingLeft: "15%",
            paddingRight: "15%",
          }}
        >
          Skip the shoot
        </div>
      </motion.div>
    </div>
  )
}

