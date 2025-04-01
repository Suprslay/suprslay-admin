"use client"

import { useEffect, useState, useRef } from "react"
import {
  IMAGE_URLS,
  FINAL_VIDEO_URL_DESKTOP,
  FINAL_VIDEO_URL_MOBILE,
  BACKGROUND_IMAGE_URL_DESKTOP,
  BACKGROUND_IMAGE_URL_MOBILE,
} from "@/constants/animation-constants"
import { useMediaQuery } from "@/hooks/use-media-query"

// Background music URL
const BACKGROUND_MUSIC_URL = "https://public-slay.s3.us-east-1.amazonaws.com/public/slay-1.mp3"

interface ImagePreloaderProps {
  onImagesLoaded: () => void
}

export default function ImagePreloader({ onImagesLoaded }: ImagePreloaderProps) {
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const videoDesktopRef = useRef<HTMLVideoElement | null>(null)
  const videoMobileRef = useRef<HTMLVideoElement | null>(null)
  const loadedCountRef = useRef(0)
  // Reduce total assets count by 1 to exclude audio from the critical path
  const totalAssetsRef = useRef(IMAGE_URLS.length + 4) // Images + 2 videos + 2 background images
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    console.log("Starting asset preloading")
    loadedCountRef.current = 0

    // Function to update progress
    const updateProgress = () => {
      loadedCountRef.current++
      const progress = Math.floor((loadedCountRef.current / totalAssetsRef.current) * 100)
      setLoadingProgress(progress)
      console.log(`Loading progress: ${progress}%`)

      // Check if all assets are loaded
      if (loadedCountRef.current >= totalAssetsRef.current) {
        console.log("All assets loaded")
        setAssetsLoaded(true)
        onImagesLoaded()
      }
    }

    // Preload and decode images
    const preloadImages = async () => {
      // First preload the background images
      try {
        // Preload desktop background image
        const bgDesktop = new Image()
        bgDesktop.src = BACKGROUND_IMAGE_URL_DESKTOP
        bgDesktop.crossOrigin = "anonymous"

        // Wait for desktop background image to load
        await new Promise<void>((resolve, reject) => {
          bgDesktop.onload = () => resolve()
          bgDesktop.onerror = () => {
            console.error(`Failed to load desktop background image:`, BACKGROUND_IMAGE_URL_DESKTOP)
            reject()
          }
        })

        // Decode desktop background image
        if ("decode" in bgDesktop) {
          await bgDesktop.decode().catch((err) => {
            console.warn(`Failed to decode desktop background image:`, err)
          })
        }

        console.log(`Desktop background image loaded and decoded`)
        updateProgress()

        // Preload mobile background image
        const bgMobile = new Image()
        bgMobile.src = BACKGROUND_IMAGE_URL_MOBILE
        bgMobile.crossOrigin = "anonymous"

        // Wait for mobile background image to load
        await new Promise<void>((resolve, reject) => {
          bgMobile.onload = () => resolve()
          bgMobile.onerror = () => {
            console.error(`Failed to load mobile background image:`, BACKGROUND_IMAGE_URL_MOBILE)
            reject()
          }
        })

        // Decode mobile background image
        if ("decode" in bgMobile) {
          await bgMobile.decode().catch((err) => {
            console.warn(`Failed to decode mobile background image:`, err)
          })
        }

        console.log(`Mobile background image loaded and decoded`)
        updateProgress()
      } catch (error) {
        console.error(`Error with background images:`, error)
        // Count as loaded anyway to avoid getting stuck
        updateProgress()
        updateProgress() // Call twice for both images
      }

      // Then preload the slideshow images
      for (let i = 0; i < IMAGE_URLS.length; i++) {
        try {
          const img = new Image()
          img.src = IMAGE_URLS[i]
          img.crossOrigin = "anonymous"

          // Wait for image to load
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = () => {
              console.error(`Failed to load image ${i}:`, IMAGE_URLS[i])
              reject()
            }
          })

          // Decode image to prepare it for smooth rendering
          if ("decode" in img) {
            await img.decode().catch((err) => {
              console.warn(`Failed to decode image ${i}:`, err)
            })
          }

          console.log(`Image ${i} loaded and decoded: ${IMAGE_URLS[i]}`)
          updateProgress()
        } catch (error) {
          console.error(`Error with image ${i}:`, error)
          updateProgress() // Count as loaded anyway to avoid getting stuck
        }
      }
    }

    // Start preloading images
    preloadImages()

    // Preload desktop video
    const videoDesktop = document.createElement("video")
    videoDesktopRef.current = videoDesktop
    videoDesktop.preload = "auto"
    videoDesktop.muted = true
    videoDesktop.src = FINAL_VIDEO_URL_DESKTOP

    videoDesktop.onloadeddata = () => {
      console.log("Desktop video preloaded successfully")
      updateProgress()
    }

    videoDesktop.onerror = () => {
      console.error("Failed to preload desktop video")
      updateProgress() // Count as loaded anyway to avoid getting stuck
    }

    // Preload mobile video
    const videoMobile = document.createElement("video")
    videoMobileRef.current = videoMobile
    videoMobile.preload = "auto"
    videoMobile.muted = true
    videoMobile.src = FINAL_VIDEO_URL_MOBILE

    videoMobile.onloadeddata = () => {
      console.log("Mobile video preloaded successfully")
      updateProgress()
    }

    videoMobile.onerror = () => {
      console.error("Failed to preload mobile video")
      updateProgress() // Count as loaded anyway to avoid getting stuck
    }

    // Fallback in case loading takes too long
    const timeout = setTimeout(() => {
      if (!assetsLoaded) {
        console.log("Loading timeout reached, continuing anyway")
        setAssetsLoaded(true)
        onImagesLoaded()
      }
    }, 15000) // 15 second timeout

    return () => {
      clearTimeout(timeout)
    }
  }, [onImagesLoaded])

  return null
}

