"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"

interface AudioPlayerProps {
  audioUrl: string
  loopCount: number
  isPlaying: boolean
}

export default function AudioPlayer({ audioUrl, loopCount, isPlaying }: AudioPlayerProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [loadError, setLoadError] = useState<Error | null>(null)
  const [userInteracted, setUserInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef(isPlaying)
  const firstPlayRef = useRef(true)
  const audioUrlRef = useRef(audioUrl)

  // Update ref when isPlaying changes
  useEffect(() => {
    isPlayingRef.current = isPlaying
    console.log(`Audio playing state changed to: ${isPlaying}`)
  }, [isPlaying])

  // Update audioUrlRef when audioUrl changes
  useEffect(() => {
    audioUrlRef.current = audioUrl
  }, [audioUrl])

  // Create audio element when component mounts
  useEffect(() => {
    console.log(`Initializing audio with URL: ${audioUrl}`)

    // Create the audio element
    let audio: HTMLAudioElement | null = null

    const initAudio = () => {
      try {
        // Clean up any existing audio element
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.src = ""
          audioRef.current.load()
        }

        // Create a new audio element
        audio = new Audio()
        audio.loop = true
        audio.muted = true
        audio.crossOrigin = "anonymous" // Add CORS support
        audio.preload = "auto"
        audioRef.current = audio

        // Reset states
        setAudioLoaded(false)
        setLoadError(null)

        // Set up event listeners
        const handleCanPlay = () => {
          console.log("Audio can now play")
          setAudioLoaded(true)
        }

        const handleError = (e: Event) => {
          const error = e as ErrorEvent
          console.error("Audio loading error:", error)

          // Create a more detailed error object
          const errorDetails = {
            message: "Failed to load audio",
            originalError: error,
            url: audioUrlRef.current,
          }

          setLoadError(new Error(JSON.stringify(errorDetails)))

          // We'll still set audioLoaded to true so the UI doesn't get stuck
          setAudioLoaded(true)

          // Try with an embedded audio element as fallback
          tryFallbackMethod()
        }

        audio.addEventListener("canplay", handleCanPlay)
        audio.addEventListener("error", handleError)

        // Set the source last (after event listeners)
        audio.src = audioUrlRef.current

        return () => {
          if (audio) {
            audio.removeEventListener("canplay", handleCanPlay)
            audio.removeEventListener("error", handleError)
          }
        }
      } catch (err) {
        console.error("Error initializing audio:", err)
        setLoadError(err instanceof Error ? err : new Error(String(err)))
        setAudioLoaded(true) // Prevent UI from getting stuck

        // Try fallback method
        tryFallbackMethod()

        return () => {}
      }
    }

    // Fallback method using an embedded audio element
    const tryFallbackMethod = () => {
      console.log("Trying fallback audio method")

      // Create an embedded audio element in the DOM
      const audioElement = document.createElement("audio")
      audioElement.style.display = "none"
      audioElement.id = "fallback-audio"
      audioElement.loop = true
      audioElement.muted = true
      audioElement.crossOrigin = "anonymous"
      audioElement.preload = "auto"

      // Add source element
      const source = document.createElement("source")
      source.src = audioUrlRef.current
      source.type = "audio/mpeg"
      audioElement.appendChild(source)

      // Add event listeners
      audioElement.addEventListener("canplay", () => {
        console.log("Fallback audio can play")
        setAudioLoaded(true)
        audioRef.current = audioElement
      })

      // Append to body
      document.body.appendChild(audioElement)

      // Return cleanup function
      return () => {
        if (document.getElementById("fallback-audio")) {
          document.body.removeChild(audioElement)
        }
      }
    }

    // Initialize audio
    const cleanup = initAudio()

    // Add a global interaction listener for mobile
    const unlockAudio = () => {
      if (!userInteracted) {
        setUserInteracted(true)

        // Try to play audio after user interaction
        if (audioRef.current && isPlayingRef.current) {
          audioRef.current.play().catch((err) => {
            console.warn("Still couldn't play audio after interaction:", err)
          })
        }
      }
    }

    document.addEventListener("touchstart", unlockAudio, { once: true })
    document.addEventListener("click", unlockAudio, { once: true })

    return () => {
      // Clean up
      cleanup()
      document.removeEventListener("touchstart", unlockAudio)
      document.removeEventListener("click", unlockAudio)

      if (audioRef.current) {
        try {
          audioRef.current.pause()
          audioRef.current.src = ""
          audioRef.current = null
        } catch (e) {
          console.error("Error cleaning up audio:", e)
        }
      }

      // Remove fallback audio if it exists
      const fallbackAudio = document.getElementById("fallback-audio")
      if (fallbackAudio) {
        document.body.removeChild(fallbackAudio)
      }
    }
  }, [audioUrl, userInteracted])

  // Handle loop count changes - restart audio when loop restarts
  useEffect(() => {
    if (audioRef.current && loopCount > 0 && audioLoaded && isPlayingRef.current) {
      console.log("Restarting audio from beginning due to loop restart")

      try {
        audioRef.current.currentTime = 0
        firstPlayRef.current = true // Reset first play flag for new loop

        // Make sure to play only if isPlaying is true
        if (isPlayingRef.current && (userInteracted || !isMobile())) {
          const playPromise = audioRef.current.play()
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn("Auto-play prevented by browser on loop restart:", error)
            })
          }
        }
      } catch (e) {
        console.error("Error restarting audio:", e)
      }
    }
  }, [loopCount, audioLoaded])

  // Handle play/pause based on isPlaying prop
  useEffect(() => {
    if (!audioRef.current || !audioLoaded) return

    if (isPlaying) {
      try {
        // If this is the first time playing in this loop, start from the beginning
        if (firstPlayRef.current) {
          console.log("Starting background music from the beginning")
          audioRef.current.currentTime = 0
          firstPlayRef.current = false
        } else {
          console.log("Resuming background music")
        }

        // Only try to play if user has interacted or we're not on mobile
        if (userInteracted || !isMobile()) {
          // Try to play the audio
          const playPromise = audioRef.current.play()

          // Handle play promise (might be rejected if user hasn't interacted with the page)
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn("Auto-play prevented by browser:", error)
            })
          }
        }
      } catch (e) {
        console.error("Error playing audio:", e)
      }
    } else {
      // Pause audio when not playing
      console.log("Pausing background music")

      // Use a try-catch block to handle any potential errors
      try {
        // Check if audio is actually playing before trying to pause
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause()
        }
      } catch (error) {
        console.error("Error pausing audio:", error)
      }
    }
  }, [isPlaying, audioLoaded, userInteracted])

  // Handle mute/unmute
  useEffect(() => {
    if (!audioRef.current) return

    try {
      audioRef.current.muted = isMuted
      console.log(`Audio ${isMuted ? "muted" : "unmuted"}`)

      // If unmuting, try to play if it should be playing
      if (!isMuted && isPlayingRef.current && audioRef.current.paused) {
        audioRef.current.play().catch((err) => {
          console.warn("Couldn't play when unmuting:", err)
        })
      }
    } catch (e) {
      console.error("Error changing mute state:", e)
    }
  }, [isMuted])

  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted)
    setUserInteracted(true) // Mark that user has interacted
  }

  // Helper to detect mobile
  const isMobile = () => {
    return (
      typeof window !== "undefined" &&
      (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i))
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleMute}
        className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-full hover:bg-opacity-30 transition-all duration-300 focus:outline-none"
        aria-label={isMuted ? "Unmute background music" : "Mute background music"}
      >
        {isMuted ? <VolumeX className="w-6 h-6 text-[#E43D12]" /> : <Volume2 className="w-6 h-6 text-[#E43D12]" />}
      </button>

      {/* Hidden audio element as fallback */}
      <audio id="inline-audio" src={audioUrl} loop muted={isMuted} preload="auto" style={{ display: "none" }} />
    </div>
  )
}

