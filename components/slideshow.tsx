"use client"

import { useEffect, useState, useRef } from "react"
import { IMAGE_URLS, FINAL_IMAGE_INDEX, SLIDESHOW_INTERVAL } from "@/constants/animation-constants"

interface SlideshowProps {
  active: boolean
  onSlideshowComplete: () => void
}

export default function Slideshow({ active, onSlideshowComplete }: SlideshowProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [nextImageIndex, setNextImageIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const completedRef = useRef(false)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const animationFrameRef = useRef<number | null>(null)

  // Preload and decode images when component mounts
  useEffect(() => {
    // Create array to hold all image elements
    const imageElements: HTMLImageElement[] = []

    // Preload and decode all images
    const preloadImages = async () => {
      for (let i = 0; i < IMAGE_URLS.length; i++) {
        try {
          // Create image element
          const img = new Image()
          img.src = IMAGE_URLS[i]
          img.crossOrigin = "anonymous"

          // Add to our array
          imageElements.push(img)

          // Wait for image to load
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = () => reject()
          })

          // Decode image to prepare it for smooth rendering
          if ("decode" in img) {
            await img.decode()
          }

          console.log(`Slideshow image ${i} preloaded and decoded`)
        } catch (error) {
          console.error(`Failed to preload/decode image ${i}:`, error)
        }
      }

      // Store reference to all preloaded images
      imagesRef.current = imageElements
    }

    preloadImages()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Reset state when component mounts (for looping)
  useEffect(() => {
    setCurrentImageIndex(0)
    setNextImageIndex(1)
    setIsTransitioning(false)
    completedRef.current = false

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Reset state if not active
    if (!active) {
      return
    }

    console.log("Slideshow component is active")

    // Only start the slideshow if it hasn't completed yet
    if (completedRef.current) {
      return
    }

    console.log("Starting slideshow animation sequence")

    // Use requestAnimationFrame for smoother transitions
    const startTime = performance.now()
    let lastTransitionTime = startTime

    const animateSlideshow = (timestamp: number) => {
      // Check if enough time has passed for the next transition
      if (timestamp - lastTransitionTime >= SLIDESHOW_INTERVAL) {
        lastTransitionTime = timestamp

        if (!isTransitioning) {
          setIsTransitioning(true)

          // Prepare next image index
          const nextIndex = (currentImageIndex + 1) % IMAGE_URLS.length
          setNextImageIndex(nextIndex)

          // After a short delay, complete the transition
          setTimeout(() => {
            setCurrentImageIndex(nextIndex)
            setIsTransitioning(false)

            // Check if we've reached the final image
            if (nextIndex === FINAL_IMAGE_INDEX) {
              console.log("Slideshow reached final image, completing")
              completedRef.current = true

              // Start the fade out animation after a short delay
              setTimeout(() => {
                onSlideshowComplete()
              }, 500)

              return
            }
          }, 50) // Short delay for smoother transition
        }
      }

      // Continue animation loop if not completed
      if (!completedRef.current) {
        animationFrameRef.current = requestAnimationFrame(animateSlideshow)
      }
    }

    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(animateSlideshow)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [active, currentImageIndex, isTransitioning, onSlideshowComplete])

  // Don't render anything if not active
  if (!active) {
    return null
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
      style={{
        // Ensure no transitions or animations at the container level
        transition: "none",
        animation: "none",
      }}
    >
      <div
        style={{
          // Fixed size container with 10% reduction from previous size
          width: "475.2px", // 528px * 0.9 = 475.2px (10% smaller than before)
          height: "648px", // 720px * 0.9 = 648px (10% smaller than before)
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Ensure no transitions or animations
          transition: "none",
          animation: "none",
          position: "relative",
          willChange: "transform", // Hint to browser to optimize rendering
        }}
      >
        {/* Current image */}
        <img
          src={IMAGE_URLS[currentImageIndex] || "/placeholder.svg"}
          alt="Fashion model"
          style={{
            maxHeight: "90vh", // Increased from 80vh to 90vh (additional 12.5% increase)
            width: "auto",
            objectFit: "contain",
            position: "absolute",
            willChange: "transform, opacity", // Optimize for transforms and opacity changes
            // Explicitly disable all transitions and animations
            transition: "none",
            animation: "none",
            transform: "none",
          }}
        />
      </div>
    </div>
  )
}

