"use client"

import { useEffect, useRef, useState } from "react"
import { FINAL_VIDEO_URL_DESKTOP, FINAL_VIDEO_URL_MOBILE } from "@/constants/animation-constants"
import { useMediaQuery } from "@/hooks/use-media-query"

interface VideoPlayerProps {
  active: boolean
  preload?: boolean
  onVideoEnded?: () => void
}

export default function VideoPlayer({ active, preload = false, onVideoEnded }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [userInteracted, setUserInteracted] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const activeRef = useRef(active)

  // Select the appropriate video URL based on screen size
  const videoUrl = isMobile ? FINAL_VIDEO_URL_MOBILE : FINAL_VIDEO_URL_DESKTOP

  // Update active ref when prop changes
  useEffect(() => {
    activeRef.current = active
  }, [active])

  // Add global interaction listener for mobile
  useEffect(() => {
    const unlockVideo = () => {
      if (!userInteracted) {
        setUserInteracted(true)

        // Try to play video if it's active
        if (videoRef.current && activeRef.current && !useFallback) {
          videoRef.current.play().catch((err) => {
            // Switch to fallback after interaction error
            setUseFallback(true)
          })
        }
      }
    }

    document.addEventListener("touchstart", unlockVideo)
    document.addEventListener("click", unlockVideo)

    return () => {
      document.removeEventListener("touchstart", unlockVideo)
      document.removeEventListener("click", unlockVideo)
    }
  }, [userInteracted, useFallback])

  // Preload video when component mounts
  useEffect(() => {
    if (videoRef.current && !useFallback) {
      // Set preload attribute to auto
      videoRef.current.preload = "auto"

      // Force load the video
      videoRef.current.load()

      // Listen for loaded data event
      const handleLoaded = () => {
        setVideoLoaded(true)
      }

      const handleError = (e: Event) => {
        // Switch to fallback on load error
        setUseFallback(true)
      }

      videoRef.current.addEventListener("loadeddata", handleLoaded)
      videoRef.current.addEventListener("error", handleError)

      // Try to buffer some of the video in advance
      if (preload) {
        try {
          // Start loading the video by playing and immediately pausing
          videoRef.current
            .play()
            .then(() => {
              videoRef.current?.pause()
              videoRef.current!.currentTime = 0
              setVideoLoaded(true)
            })
            .catch((err) => {
              // If we get a "not supported" error during preload, switch to fallback
              if (err.message && err.message.includes("not supported")) {
                setUseFallback(true)
              }
            })
        } catch (e) {
          // Error in preloading
        }
      }

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("loadeddata", handleLoaded)
          videoRef.current.removeEventListener("error", handleError)
        }
      }
    }
  }, [preload, isMobile, useFallback])

  // Reset video when inactive
  useEffect(() => {
    if (!active) {
      if (videoRef.current && !useFallback) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }, [active, useFallback])

  // Play video when active
  useEffect(() => {
    if (active && videoRef.current && !useFallback) {
      // Reset to beginning
      videoRef.current.currentTime = 0

      // Set muted to ensure autoplay works on mobile
      videoRef.current.muted = true

      // Add a small delay to ensure the video is ready
      setTimeout(() => {
        // Try to play the video with better error handling and retry logic
        const playVideo = async () => {
          try {
            // First attempt
            await videoRef.current?.play()
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)

            // If we get a "not supported" error, switch to fallback
            if (errorMessage.includes("not supported")) {
              setUseFallback(true)
              return
            }

            // For mobile, we need user interaction
            if (isMobile && !userInteracted) {
              // The global interaction listener will handle playback
            } else {
              // Try again after a short delay
              setTimeout(async () => {
                try {
                  if (videoRef.current) {
                    videoRef.current.muted = true
                    await videoRef.current.play()
                  }
                } catch (secondError) {
                  const secondErrorMessage = secondError instanceof Error ? secondError.message : String(secondError)

                  // If second attempt fails with "not supported", switch to fallback
                  if (secondErrorMessage.includes("not supported")) {
                    setUseFallback(true)
                  }
                }
              }, 500)
            }
          }
        }

        playVideo()
      }, 100)
    }
  }, [active, isMobile, userInteracted, useFallback])

  // Handle video ended event
  const handleVideoEnded = () => {
    if (onVideoEnded) {
      onVideoEnded()
    }
  }

  // Create a direct download link for the video
  const getDownloadLink = () => {
    const filename = videoUrl.split("/").pop() || "video.mp4"
    return `data:text/html,<html><head><title>Download Video</title></head><body><p>Right-click on the video and select "Save Video As..." to download:</p><video src="${videoUrl}" controls style="max-width:100%"></video></body></html>`
  }

  return (
    <div
      className={`fixed inset-0 z-30 flex items-center justify-center bg-black transition-opacity duration-1000 ${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ height: "100vh", maxHeight: "100vh", overflow: "hidden" }}
    >
      {!useFallback ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          playsInline={true}
          webkit-playsinline="true"
          x5-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          muted
          controls={false}
          preload={preload ? "auto" : "none"}
          onEnded={handleVideoEnded}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            background: "#000",
          }}
        />
      ) : (
        // Fallback: Use a compact UI for mobile
        <div
          className="w-full h-full flex flex-col items-center justify-center bg-black"
          style={{ maxHeight: "100vh" }}
        >
          <div className="text-white text-center px-4" style={{ maxWidth: "100vw" }}>
            <h2 className="text-lg font-bold mb-2">Video Preview</h2>
            <p className="text-xs opacity-70 mb-3">Video playback not supported</p>

            <div className="flex flex-col space-y-2 max-w-xs mx-auto">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Open Video
              </a>

              <button
                onClick={() => {
                  if (onVideoEnded) onVideoEnded()
                }}
                className="bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Skip Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

