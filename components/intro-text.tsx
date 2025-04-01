"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-media-query"

interface IntroTextProps {
  assetsLoaded: boolean
  onMoveStart: () => void
  onAnimationComplete: () => void
}

export default function IntroText({ assetsLoaded, onMoveStart, onAnimationComplete }: IntroTextProps) {
  const [animationComplete, setAnimationComplete] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Start the transition animation when assets are loaded
  useEffect(() => {
    if (assetsLoaded && !animationComplete) {
      // Add a small delay before starting the transition
      const timer = setTimeout(() => {
        setIsMoving(true)
        // Notify parent that text is starting to move
        onMoveStart()

        // Add a delay before triggering the next animation phase
        // This should be longer than the animation duration to ensure it completes
        setTimeout(() => {
          setAnimationComplete(true)
          onAnimationComplete()
        }, 2000) // Wait for the 1.5s animation to complete
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [assetsLoaded, animationComplete, onMoveStart, onAnimationComplete])

  // Reset component state when unmounted (for loop restart)
  useEffect(() => {
    return () => {
      setAnimationComplete(false)
      setIsMoving(false)
    }
  }, [])

  // Logo dimensions
  const initialWidth = isMobile ? 280 : 400
  const initialHeight = isMobile ? 70 : 100
  const finalWidth = isMobile ? 120 : 150
  const finalHeight = isMobile ? 30 : 38

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Always show the text during loading, only hide when animation is complete */}
      {!animationComplete && (
        <motion.div
          className="absolute w-full flex justify-center"
          initial={{
            y: "50vh",
            translateY: "-50%", // Center vertically
          }}
          animate={
            isMoving
              ? {
                  y: "2rem", // Move to top with some padding
                  translateY: 0, // Remove centering
                  transition: {
                    duration: 1.5,
                    ease: "easeInOut",
                  },
                }
              : {}
          }
          style={{
            perspective: "1000px",
          }}
        >
          <motion.div
            className="relative"
            initial={{
              width: initialWidth,
              height: initialHeight,
            }}
            animate={
              !isMoving
                ? {
                    scale: [0.95, 1.05, 0.95],
                    transition: {
                      scale: {
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 3,
                        ease: "easeInOut",
                      },
                    },
                  }
                : {
                    width: finalWidth,
                    height: finalHeight,
                    transition: {
                      duration: 1.5,
                      ease: "easeInOut",
                    },
                  }
            }
          >
            <Image src="/images/logo.png" alt="Suprslay" fill style={{ objectFit: "contain" }} priority />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

