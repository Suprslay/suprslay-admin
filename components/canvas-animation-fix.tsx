"use client"

import { useEffect, useRef } from "react"

export default function CanvasAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Get canvas and context
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full window size
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Updated more muted colors at 100% opacity
    const colors = ["#fff6f5", "#fff3f8", "#EBE9E1", "#fff8e6"]

    // Animation variables
    let currentColorIndex = 0
    let nextColorIndex = 1
    let isAnimatingWave = false
    let waveStartTime = 0
    let lastColorChangeTime = 0

    // Animation loop
    function animate() {
      const now = performance.now()

      // Initialize lastColorChangeTime on first run
      if (lastColorChangeTime === 0) {
        lastColorChangeTime = now
      }

      // Check if it's time to change colors (every 5 seconds)
      if (!isAnimatingWave && now - lastColorChangeTime >= 5000) {
        isAnimatingWave = true
        waveStartTime = now
      }

      // Clear canvas with white
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (isAnimatingWave) {
        // Calculate wave progress (0 to 1) over 1.5 seconds
        const elapsed = now - waveStartTime
        const progress = Math.min(1, elapsed / 1500)

        // Get colors
        const currentColor = colors[currentColorIndex]
        const nextColor = colors[nextColorIndex]

        // Draw current color as background
        ctx.fillStyle = currentColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw expanding circle with next color
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        // Make sure the radius is large enough to cover the entire screen
        const maxRadius =
          Math.sqrt(
            Math.pow(Math.max(centerX, canvas.width - centerX), 2) +
              Math.pow(Math.max(centerY, canvas.height - centerY), 2),
          ) * 1.2 // Add 20% to ensure full coverage

        const radius = maxRadius * progress

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.fillStyle = nextColor
        ctx.fill()

        // If wave animation is complete
        if (progress >= 1) {
          // Draw one final frame with the next color
          ctx.fillStyle = nextColor
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          // Update color indices
          currentColorIndex = nextColorIndex
          nextColorIndex = (nextColorIndex + 1) % colors.length

          // Reset animation state
          isAnimatingWave = false
          lastColorChangeTime = now
        }
      } else {
        // Just draw current color
        ctx.fillStyle = colors[currentColorIndex]
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // Continue animation loop
      requestAnimationFrame(animate)
    }

    // Handle window resize
    function handleResize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  )
}

