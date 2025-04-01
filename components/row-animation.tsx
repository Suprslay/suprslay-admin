"use client"

import { useEffect, useState, useRef } from "react"
import {
  IMAGE_URLS,
  FINAL_IMAGE_INDEX,
  FINAL_CENTER_IMAGE_INDEX,
  IMAGE_WIDTH,
  IMAGE_APPEARANCE_DELAY,
  SHIFT_DELAY,
  MAX_RIGHT_IMAGES,
  COLLAPSE_DURATION,
} from "@/constants/animation-constants"
import { type AnimationPhase, type ImagePosition, easeInOutCubic } from "@/types/animation-types"
import { useMediaQuery } from "@/hooks/use-media-query"

interface RowAnimationProps {
  active: boolean
  animationPhase: AnimationPhase
  setAnimationPhase: (phase: AnimationPhase) => void
  revealActive?: boolean // Add prop to know when reveal is active
}

export default function RowAnimation({
  active,
  animationPhase,
  setAnimationPhase,
  revealActive = false,
}: RowAnimationProps) {
  const [imagePositions, setImagePositions] = useState<ImagePosition[]>([])
  const [centerPosition, setCenterPosition] = useState(0)
  const [collapseProgress, setCollapseProgress] = useState(0)
  const imagePositionsRef = useRef<ImagePosition[]>([])
  const [opacity, setOpacity] = useState(1)
  const animationCompletedRef = useRef(false)
  const animationStartedRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)

  // Check if device is mobile
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Reset state when component mounts (for looping)
  useEffect(() => {
    // Reset all refs and states
    animationCompletedRef.current = false
    animationStartedRef.current = false
    setCollapseProgress(0)
    setOpacity(1)
    setImagePositions([])
    setCenterPosition(0)

    return () => {
      // Clean up any animation frames
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Update ref when imagePositions changes
  useEffect(() => {
    imagePositionsRef.current = imagePositions
  }, [imagePositions])

  // Initialize the row animation
  useEffect(() => {
    // Only start if active and not already started or completed
    if (!active || animationCompletedRef.current || animationStartedRef.current) return

    console.log("Starting row animation sequence")
    animationStartedRef.current = true

    // Initialize image positions - all images are created but with visibility controlled
    const initialPositions = IMAGE_URLS.map((_, index) => ({
      id: index,
      x: index === FINAL_IMAGE_INDEX ? 0 : IMAGE_WIDTH * (index + 1), // Position all other images to the right
      visible: index === FINAL_IMAGE_INDEX, // Only the final image is visible initially
    }))

    setImagePositions(initialPositions)
    setCenterPosition(0) // Center is at 0

    // Start in row phase
    setAnimationPhase("row")

    // Start the row animation sequence
    const runRowAnimation = async () => {
      // Create a list of indices excluding the final image
      const otherIndices = Array.from({ length: IMAGE_URLS.length }, (_, i) => i).filter((i) => i !== FINAL_IMAGE_INDEX)

      let visibleCount = 1 // Start with 1 (the center image)
      let currentShift = 0

      // Show images one by one
      for (let i = 0; i < otherIndices.length; i++) {
        // Wait for the appearance delay
        await new Promise((resolve) => setTimeout(resolve, IMAGE_APPEARANCE_DELAY))

        // Make the next image visible
        setImagePositions((prev) => prev.map((pos) => (pos.id === otherIndices[i] ? { ...pos, visible: true } : pos)))

        visibleCount++

        // If we've shown enough images on the right, start shifting
        if (visibleCount > MAX_RIGHT_IMAGES + 1) {
          // +1 for the center image
          // Wait for the shift delay
          await new Promise((resolve) => setTimeout(resolve, SHIFT_DELAY))

          // Shift everything left by one image width
          currentShift += IMAGE_WIDTH
          setCenterPosition(-currentShift)

          setImagePositions((prev) =>
            prev.map((pos) => ({
              ...pos,
              x:
                pos.id === FINAL_IMAGE_INDEX
                  ? -currentShift // Keep the final image at the center position
                  : pos.x - IMAGE_WIDTH, // Shift other images left
            })),
          )
        }
      }

      // After all images are shown, wait a moment then start the collapse
      await new Promise((resolve) => setTimeout(resolve, 300)) // Reduced from 500ms to 300ms for faster transition
      console.log("Starting collapse phase")
      setAnimationPhase("collapse")

      // Animate the collapse progress smoothly
      const startTime = Date.now()

      const animateCollapse = () => {
        const elapsed = Date.now() - startTime
        const rawProgress = Math.min(1, elapsed / COLLAPSE_DURATION)

        // Apply easing function for smoother animation
        const progress = easeInOutCubic(rawProgress)
        setCollapseProgress(progress)

        if (rawProgress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateCollapse)
        } else {
          // When collapse is complete, move to final phase and stay there
          console.log("Collapse complete, moving to final phase")
          setAnimationPhase("final")
          animationCompletedRef.current = true
        }
      }

      animationFrameRef.current = requestAnimationFrame(animateCollapse)
    }

    runRowAnimation()

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [active, setAnimationPhase])

  if (!active) {
    return null
  }

  // Calculate image dimensions
  // Desktop: 475.2px × 648px (10% smaller than original 528px × 720px)
  // Mobile: 427.68px × 583.2px (10% smaller than desktop size)
  const desktopWidth = 475.2
  const desktopHeight = 648
  const mobileWidth = desktopWidth * 0.9 // 10% smaller
  const mobileHeight = desktopHeight * 0.9 // 10% smaller

  // Use different dimensions based on screen size
  const imageWidth = isMobile ? `${mobileWidth}px` : `${desktopWidth}px`
  const imageHeight = isMobile ? `${mobileHeight}px` : `${desktopHeight}px`
  const marginLeft = isMobile ? `${-mobileWidth / 2}px` : `${-desktopWidth / 2}px`
  const marginTop = isMobile ? `${-mobileHeight / 2}px` : `${-desktopHeight / 2}px`

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-50"
      style={{
        opacity: opacity,
        transition: "opacity 1s ease-out",
      }}
    >
      <div
        className="relative"
        style={{
          height: isMobile ? "70vh" : "90vh",
          width: `${window.innerWidth}px`,
        }}
      >
        {imagePositions.map((position) => {
          const isInitialCenter = position.id === FINAL_IMAGE_INDEX
          const isFinalCenter = position.id === FINAL_CENTER_IMAGE_INDEX

          // Skip rendering the center image when reveal is active
          if (revealActive && isFinalCenter) {
            return null
          }

          // Get original position before collapse
          const originalXPos = window.innerWidth / 2 + position.x

          // Calculate position for collapse animation (no scaling)
          let xPos = originalXPos

          if (animationPhase === "collapse" || animationPhase === "final") {
            // Calculate the center position (where all images should move to)
            const centerX = window.innerWidth / 2

            // Use the collapse progress for smooth animation
            const progress = animationPhase === "collapse" ? collapseProgress : 1

            // Gradually move images toward the center
            xPos = originalXPos + (centerX - originalXPos) * progress
          }

          // Calculate opacity
          let opacity = 0

          if (position.visible) {
            if (animationPhase === "row") {
              // During row phase, show all visible images
              opacity = 1
            } else if (animationPhase === "collapse") {
              // During collapse, fade out non-center images gradually as they move
              if (isFinalCenter) {
                opacity = 1
              } else {
                // Start fading as soon as they start moving
                // The further they are from their original position, the more transparent they become
                const distanceProgress = Math.abs(xPos - originalXPos) / Math.abs(window.innerWidth / 2 - originalXPos)
                opacity = 1 - distanceProgress * 0.8 // Keep a bit of opacity until the end
              }
            } else if (animationPhase === "final") {
              // In final phase, only show the center image
              opacity = isFinalCenter ? 1 : 0
            }
          }

          // Don't render non-visible images in final phase
          if (animationPhase === "final" && !isFinalCenter) {
            return null
          }

          // Completely different approach to rendering the images
          return (
            <div
              key={position.id}
              style={{
                position: "absolute",
                left: `${xPos}px`,
                top: "50%",
                marginLeft: marginLeft,
                marginTop: marginTop,
                opacity: position.visible ? opacity : 0,
                zIndex: isFinalCenter ? 10 : 1,
                // Faster transition for left position to match faster collapse
                transition: "opacity 0.2s ease-out, left 0.3s ease-out",
                width: imageWidth,
                height: imageHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "visible", // Ensure image isn't clipped
              }}
            >
              {/* Pre-load all images at full size but hide them until needed */}
              <img
                src={IMAGE_URLS[position.id] || "/placeholder.svg"}
                alt={`Fashion model ${position.id + 1}`}
                style={{
                  maxHeight: isMobile ? "70vh" : "90vh", // Adjust max height for mobile
                  width: "auto",
                  objectFit: "contain",
                  // Explicitly disable all transitions and animations
                  transition: "none",
                  animation: "none",
                  transform: "none",
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

