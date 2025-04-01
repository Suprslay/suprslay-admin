"use client"

import { useState, useEffect, useRef } from "react"
import type { AnimationPhase } from "@/types/animation-types"
import ImagePreloader from "./image-preloader"
import IntroText from "./intro-text"
import Slideshow from "./slideshow"
import RowAnimation from "./row-animation"
import PerspectiveWaitlist from "./perspective-waitlist"
import RectangleReveal from "./rectangle-reveal"
import SlidingText from "./sliding-text"
import MobileSlidingText from "./mobile-sliding-text"
import VideoPlayer from "./video-player"
import CanvasAnimation from "./canvas-animation-fix"
import AudioPlayer from "./audio-player"
import { useMediaQuery } from "@/hooks/use-media-query"
import { BACKGROUND_MUSIC_URL } from "@/constants/animation-constants"
import Image from "next/image"

// Define a new type for the application phases that includes the intro
type AppPhase = "intro" | "slideshow" | "row" | "collapse" | "final" | "reveal" | "video" // Added video phase

export default function HalftoneWaves() {
  // Animation state
  const [imagesLoaded, setImagesLoaded] = useState(false) // Start with false to ensure loading happens
  const [textMoving, setTextMoving] = useState(false) // Track when text starts moving
  const [slideshowReady, setSlideshowReady] = useState(false) // New state to delay slideshow start
  const [introComplete, setIntroComplete] = useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [slideshowComplete, setSlideshowComplete] = useState(false)
  const [appPhase, setAppPhase] = useState<AppPhase>("intro")
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("slideshow")
  const [revealActive, setRevealActive] = useState(false) // New state for the reveal animation
  const [videoActive, setVideoActive] = useState(false) // New state for the video
  const [slidingTextActive, setSlidingTextActive] = useState(false) // New state for sliding text
  const [loopCount, setLoopCount] = useState(0) // Track number of loops for key changes
  const [audioPlaying, setAudioPlaying] = useState(false) // Track if audio should be playing

  // Refs for animation control
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const slideshowDelayRef = useRef<NodeJS.Timeout | null>(null)
  const revealDelayRef = useRef<NodeJS.Timeout | null>(null) // New ref for reveal delay
  const videoDelayRef = useRef<NodeJS.Timeout | null>(null) // New ref for video delay
  const isRestartingRef = useRef(false)
  const revealCompletedRef = useRef(false) // Track if reveal has completed

  // Check if device is mobile
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Handle when text starts moving
  const handleTextMoving = () => {
    setTextMoving(true)

    // Add a delay before starting the slideshow
    slideshowDelayRef.current = setTimeout(() => {
      setSlideshowReady(true)
      setAppPhase("slideshow")

      // Start playing audio when slideshow starts
      setAudioPlaying(true)
    }, 800) // 800ms delay to let text move up a bit first
  }

  // Handle intro animation completion
  const handleIntroComplete = () => {
    setIntroComplete(true)
    setInitialLoadComplete(true) // Mark that we've completed the initial load with intro
  }

  // Handle video completion
  const handleVideoEnded = () => {
    isRestartingRef.current = true

    // Add a small delay before restarting
    restartTimeoutRef.current = setTimeout(() => {
      resetAnimation()
    }, 1000) // 1 second delay after video ends before restarting
  }

  // Watch for app phase changes to control audio
  useEffect(() => {
    // Only start audio when slideshow phase begins
    if (appPhase === "slideshow" && !audioPlaying) {
      setAudioPlaying(true)
    }
  }, [appPhase, audioPlaying])

  // Handle animation phase changes
  useEffect(() => {
    // Start sliding text when collapse phase begins
    if (animationPhase === "collapse" && !slidingTextActive) {
      setSlidingTextActive(true)
    }

    // When animation reaches final phase, start the reveal animation after a delay
    if (animationPhase === "final" && !isRestartingRef.current) {
      // Reset reveal completed flag
      revealCompletedRef.current = false

      // Set app phase to final immediately
      setAppPhase("final")

      // Clear any existing reveal delay
      if (revealDelayRef.current) {
        clearTimeout(revealDelayRef.current)
      }

      // Add a longer delay before starting the rectangle reveal
      revealDelayRef.current = setTimeout(() => {
        setAppPhase("reveal")
        setRevealActive(true)

        // Schedule video playback after the reveal
        videoDelayRef.current = setTimeout(() => {
          setAppPhase("video")
          setVideoActive(true)

          // Keep the background audio playing during video
          // No need to change audioPlaying state

          // No need to schedule a restart here, as we'll restart after the video ends
        }, 2500) // 2.5 second delay after reveal starts before showing video
      }, 1500) // 1.5 second delay before starting the reveal
    }
  }, [animationPhase, slidingTextActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current)
      }
      if (slideshowDelayRef.current) {
        clearTimeout(slideshowDelayRef.current)
      }
      if (revealDelayRef.current) {
        clearTimeout(revealDelayRef.current)
      }
      if (videoDelayRef.current) {
        clearTimeout(videoDelayRef.current)
      }
    }
  }, [])

  // Reset all animation states to start over
  const resetAnimation = () => {
    // Don't reset introComplete on subsequent loops
    setSlideshowComplete(false)
    setTextMoving(false)
    setSlideshowReady(false)
    setRevealActive(false) // Reset the reveal animation
    setVideoActive(false) // Reset the video state
    setSlidingTextActive(false) // Reset the sliding text animation
    // Skip intro phase on subsequent loops
    setAppPhase(initialLoadComplete ? "slideshow" : "intro")
    setAnimationPhase("slideshow")
    setLoopCount((prev) => prev + 1) // Increment loop count to force component remounts
    isRestartingRef.current = false

    // Make sure audio is playing when animation restarts (only if we're skipping intro)
    if (initialLoadComplete) {
      setAudioPlaying(true)
    } else {
      setAudioPlaying(false) // Ensure audio is not playing during intro
    }

    // For subsequent loops, we can skip the loading phase
    if (initialLoadComplete) {
      setImagesLoaded(true)
    }
  }

  // Event handlers
  const handleImagesLoaded = () => {
    setImagesLoaded(true)
  }

  const handleSlideshowComplete = () => {
    setSlideshowComplete(true)
    setAppPhase("row")
  }

  // Prevent scrolling on mobile
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault()
    }

    // Apply to document and body
    document.addEventListener("touchmove", preventScroll, { passive: false })

    return () => {
      document.removeEventListener("touchmove", preventScroll)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        height: "100vh",
        maxHeight: "100vh",
        width: "100vw",
        maxWidth: "100vw",
        position: "fixed",
        touchAction: "none", // Prevent all touch actions
      }}
    >
      {/* Canvas animation background with circular wipes */}
      <CanvasAnimation />

      {/* Audio player - only render when audio should be playing */}
      {initialLoadComplete && (
        <AudioPlayer audioUrl={BACKGROUND_MUSIC_URL} loopCount={loopCount} isPlaying={audioPlaying} />
      )}

      {/* Video player - preload during intro, show after reveal */}
      <VideoPlayer
        active={videoActive}
        preload={true} // Always preload the video
        onVideoEnded={handleVideoEnded} // Handle video completion
      />

      {/* Rectangle reveal animation - always rendered but only active when needed */}
      <RectangleReveal
        key={`rectangle-reveal-${loopCount}`} // Force remount on loop restart
        active={revealActive && !videoActive} // Hide when video is active
        loopCount={loopCount}
      />

      {/* Sliding text animation - use different components for mobile and desktop */}
      {isMobile ? (
        <MobileSlidingText
          key={`mobile-sliding-text-${loopCount}`} // Force remount on loop restart
          active={slidingTextActive}
          revealActive={revealActive} // Pass reveal state to control exit animation
          loopCount={loopCount}
        />
      ) : (
        <SlidingText
          key={`sliding-text-${loopCount}`} // Force remount on loop restart
          active={slidingTextActive}
          revealActive={revealActive} // Pass reveal state to control exit animation
          loopCount={loopCount}
        />
      )}

      {/* Loading indicator - show during initial load */}
      <ImagePreloader onImagesLoaded={handleImagesLoaded} />

      {/* Intro text - show until all assets are loaded and intro is complete */}
      <IntroText assetsLoaded={imagesLoaded} onMoveStart={handleTextMoving} onAnimationComplete={handleIntroComplete} />

      {/* Logo header - show after intro is complete */}
      {initialLoadComplete && (
        <div className="fixed top-6 left-0 right-0 text-center z-50 flex justify-center items-center">
          <div
            className="relative"
            style={{
              width: isMobile ? "120px" : "150px",
              height: isMobile ? "30px" : "38px",
            }}
          >
            <Image src="/images/logo.png" alt="Suprslay" fill style={{ objectFit: "contain" }} priority />
          </div>
        </div>
      )}

      {/* Slideshow - active during slideshow phase and after delay */}
      <Slideshow
        key={`slideshow-${loopCount}`} // Force remount on loop restart
        active={
          imagesLoaded &&
          (initialLoadComplete || (textMoving && slideshowReady)) &&
          appPhase === "slideshow" &&
          !slideshowComplete
        }
        onSlideshowComplete={handleSlideshowComplete}
      />

      {/* Row animation - start after slideshow completes */}
      <RowAnimation
        key={`row-animation-${loopCount}`} // Force remount on loop restart
        active={
          slideshowComplete &&
          (appPhase === "row" || appPhase === "collapse" || appPhase === "final" || appPhase === "reveal") &&
          !videoActive
        }
        animationPhase={animationPhase}
        setAnimationPhase={setAnimationPhase}
        revealActive={revealActive} // Pass reveal state to control center image fade out
      />

      {/* Perspective waitlist button - show after slideshow completes */}
      <PerspectiveWaitlist active={slideshowComplete && !videoActive} />
    </div>
  )
}

