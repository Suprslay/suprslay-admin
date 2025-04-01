"use client"

import { useEffect, useRef } from "react"
import {
  BACKGROUND_IMAGE_URL_DESKTOP,
  BACKGROUND_IMAGE_URL_MOBILE,
  RECTANGLE_REVEAL_DURATION,
} from "@/constants/animation-constants"
import { easeInOutCubic } from "@/types/animation-types"
import { useMediaQuery } from "@/hooks/use-media-query"

interface RectangleRevealProps {
  active: boolean
  loopCount: number // Add loopCount prop to force remount
}

export default function RectangleReveal({ active, loopCount }: RectangleRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const animationStartedRef = useRef(false)
  const startTimeRef = useRef<number>(0)
  const progressRef = useRef<number>(0)

  // Check if device is mobile
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Reset state when component mounts or loopCount changes
  useEffect(() => {
    console.log("Rectangle reveal reset, loop:", loopCount)
    progressRef.current = 0
    animationStartedRef.current = false

    // Add preloading for the background images
    const imageUrl = isMobile ? BACKGROUND_IMAGE_URL_MOBILE : BACKGROUND_IMAGE_URL_DESKTOP
    const preloadImage = new Image()
    preloadImage.src = imageUrl

    console.log(`Preloading rectangle reveal background image for ${isMobile ? "mobile" : "desktop"}`)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      // Clean up
      preloadImage.src = ""
    }
  }, [loopCount, isMobile])

  // Start the reveal animation when active
  useEffect(() => {
    if (!active || animationStartedRef.current) return

    console.log("Starting rectangle reveal animation")
    animationStartedRef.current = true
    startTimeRef.current = performance.now()

    const animateReveal = (timestamp: number) => {
      const elapsed = timestamp - startTimeRef.current
      const rawProgress = Math.min(1, elapsed / RECTANGLE_REVEAL_DURATION)

      // Apply easing function for smoother animation
      const progress = easeInOutCubic(rawProgress)
      progressRef.current = progress

      // Update the clip-path directly on the DOM element for smoother animation
      if (containerRef.current) {
        const innerElement = containerRef.current.firstElementChild as HTMLElement
        if (innerElement) {
          if (isMobile) {
            // Mobile: vertical reveal from center
            innerElement.style.clipPath = `polygon(
              0 ${50 - progress * 50}%, 
              100% ${50 - progress * 50}%, 
              100% ${50 + progress * 50}%, 
              0 ${50 + progress * 50}%
            )`
          } else {
            // Desktop: horizontal reveal from center
            innerElement.style.clipPath = `polygon(
              ${50 - progress * 50}% 0, 
              ${50 + progress * 50}% 0, 
              ${50 + progress * 50}% 100%, 
              ${50 - progress * 50}% 100%
            )`
          }
        }
      }

      if (rawProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateReveal)
      } else {
        console.log("Rectangle reveal complete")
      }
    }

    animationFrameRef.current = requestAnimationFrame(animateReveal)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [active, isMobile])

  // Prepare the background image URL
  const backgroundImageUrl = isMobile ? BACKGROUND_IMAGE_URL_MOBILE : BACKGROUND_IMAGE_URL_DESKTOP

  return (
    <div ref={containerRef} className="fixed inset-0 z-10 pointer-events-none overflow-hidden will-change-transform">
      {/* Background image container with hardware-accelerated properties */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.9, // Slightly transparent to blend with background
          transform: "translateZ(0)", // Force GPU acceleration
          backfaceVisibility: "hidden", // Improve performance
          perspective: "1000px", // Improve performance
          // Initial clip-path will be set by the animation
          clipPath: isMobile
            ? "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)"
            : "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
        }}
      />
    </div>
  )
}

