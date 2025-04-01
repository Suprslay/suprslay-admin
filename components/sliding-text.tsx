"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { RECTANGLE_REVEAL_DURATION } from "@/constants/animation-constants"
import { useMediaQuery } from "@/hooks/use-media-query"

interface SlidingTextProps {
  active: boolean
  loopCount: number
  revealActive: boolean // New prop to indicate when rectangle reveal is active
}

export default function SlidingText({ active, loopCount, revealActive }: SlidingTextProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const animationStartedRef = useRef(false)
  const exitAnimationStartedRef = useRef(false)

  // Check if device is mobile
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Reset state when component mounts or loopCount changes
  useEffect(() => {
    console.log("Sliding text reset, loop:", loopCount)
    setIsAnimating(false)
    setIsExiting(false)
    animationStartedRef.current = false
    exitAnimationStartedRef.current = false
  }, [loopCount])

  // Start the animation when active
  useEffect(() => {
    if (!active || animationStartedRef.current) return

    console.log("Starting sliding text animation")
    animationStartedRef.current = true

    // Start immediately without delay since we're now triggering during collapse
    setIsAnimating(true)

    return () => {}
  }, [active])

  // Start exit animation when reveal becomes active
  useEffect(() => {
    if (!revealActive || exitAnimationStartedRef.current || !animationStartedRef.current) return

    console.log("Starting sliding text exit animation")
    exitAnimationStartedRef.current = true
    setIsExiting(true)

    return () => {}
  }, [revealActive])

  if (!active) {
    return null
  }

  // Responsive text styling
  const textStyle = {
    color: "#E43D12",
    fontSize: isMobile ? "clamp(0.75rem, 5vw, 1.5rem)" : "clamp(1rem, 2.5vw, 2rem)",
    fontWeight: "bold" as const,
    letterSpacing: "0.1em",
    transform: "perspective(400px) rotateX(15deg)",
    transformOrigin: "center bottom",
    textTransform: "uppercase" as const,
    whiteSpace: "nowrap" as const,
  }

  // Responsive positioning
  const leftPosition = isMobile ? "-100%" : "-100%"
  const rightPosition = isMobile ? "100%" : "100%"
  const leftTargetPosition = isMobile ? "calc(50% - 50px)" : "calc(50% - 100px)"
  const rightTargetPosition = isMobile ? "calc(-50% + 50px)" : "calc(-50% + 100px)"
  const topPosition = isMobile ? "40%" : "50%"

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Left text - "Style yourself" */}
      <motion.div
        className="absolute left-0"
        initial={{ x: leftPosition }}
        animate={
          isAnimating
            ? {
                x: isExiting ? leftPosition : leftTargetPosition, // Slide out to the left when exiting
                transition: {
                  type: isExiting ? "tween" : "spring",
                  duration: isExiting ? RECTANGLE_REVEAL_DURATION / 1000 : undefined, // Match rectangle reveal duration
                  ease: isExiting ? "easeInOut" : undefined,
                  damping: isExiting ? undefined : 20,
                  stiffness: isExiting ? undefined : 90,
                  delay: isExiting ? 0 : 0.2,
                },
              }
            : {}
        }
        style={{
          ...textStyle,
          top: topPosition,
          transform: `translateY(-50%) perspective(400px) rotateX(15deg)`,
        }}
      >
        Style yourself
      </motion.div>

      {/* Right text - "Skip the shoot" */}
      <motion.div
        className="absolute right-0"
        initial={{ x: rightPosition }}
        animate={
          isAnimating
            ? {
                x: isExiting ? rightPosition : rightTargetPosition, // Slide out to the right when exiting
                transition: {
                  type: isExiting ? "tween" : "spring",
                  duration: isExiting ? RECTANGLE_REVEAL_DURATION / 1000 : undefined, // Match rectangle reveal duration
                  ease: isExiting ? "easeInOut" : undefined,
                  damping: isExiting ? undefined : 20,
                  stiffness: isExiting ? undefined : 90,
                  delay: isExiting ? 0 : 0.4,
                },
              }
            : {}
        }
        style={{
          ...textStyle,
          top: topPosition,
          transform: `translateY(-50%) perspective(400px) rotateX(15deg)`,
        }}
      >
        Skip the shoot
      </motion.div>
    </div>
  )
}

