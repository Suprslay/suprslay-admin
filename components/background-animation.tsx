"use client"

import { useEffect, useRef } from "react"
import { Blob, yellowColors } from "@/lib/animation"

interface BackgroundAnimationProps {
  isMobile?: boolean
}

export default function BackgroundAnimation({ isMobile = false }: BackgroundAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Organic fluid animation effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create blobs - fewer for mobile
    const blobs: Blob[] = []
    const blobCount = isMobile ? 3 : 5 // Reduce blob count on mobile for better performance

    for (let i = 0; i < blobCount; i++) {
      const color = yellowColors[i % yellowColors.length]
      const radius = 100 + Math.random() * 150
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      blobs.push(new Blob(x, y, radius, color))
    }

    // Animation variables
    let lastTime = Date.now()
    let animationFrameId: number

    const render = () => {
      // Calculate delta time for smooth animation regardless of frame rate
      const currentTime = Date.now()
      const dt = Math.min(32, currentTime - lastTime) // Cap at 32ms to avoid huge jumps
      lastTime = currentTime

      // Clear canvas with a very subtle fade effect for smoother transitions
      ctx.fillStyle = "rgba(255, 255, 255, 0.005)" // Reduced from 0.01 to 0.005 for even smoother trails
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw blobs with improved smoothness
      for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i]

        // Update with delta time for smooth animation
        // Slower updates for more gentle movement
        const updateSpeed = isMobile ? 0.1 : 0.15 // Reduced from 0.2/0.3 for slower movement
        blob.update(dt * updateSpeed)

        // Draw with decreasing opacity for depth
        blob.draw(ctx, 0.3 - i * 0.03)
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{
        background: "linear-gradient(to bottom, #EBE9E1, #EBE9E1)",
        filter: isMobile ? "blur(15px)" : "blur(20px)",
      }}
    />
  )
}

