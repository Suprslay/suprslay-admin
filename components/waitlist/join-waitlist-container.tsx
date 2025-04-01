"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import CanvasAnimation from "../canvas-animation-fix"
import type { FormStep, FormData, SubmissionStatus } from "./types"
import { initShimmerEffect } from "./utils/shimmer-effect"
import { submitToWaitlist } from "@/actions/waitlist-actions"

// Import step components
import StepName from "./steps/step-name"
import StepPersona from "./steps/step-persona"
import StepIntroduction from "./steps/step-introduction"
import StepSocials from "./steps/step-socials"
import StepSuccess from "./steps/step-success"
import Navigation from "./navigation"

export default function JoinWaitlistContainer() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<FormStep>("name")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    persona: "",
    website: "",
    introduction: "",
    instagram: "",
    linkedin: "",
    other: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize shimmer effect
  useEffect(() => {
    initShimmerEffect()

    // Prevent scrolling on mobile
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.width = "100%"
    document.body.style.height = "100%"
    document.body.style.touchAction = "none"

    return () => {
      // Restore scrolling when component unmounts
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.height = ""
      document.body.style.touchAction = ""
    }
  }, [])

  // Add this after the useEffect hook that initializes shimmer effect
  useEffect(() => {
    // Prevent zoom on input focus
    const preventZoom = (e: TouchEvent) => {
      // Don't prevent default for normal touch events
      // This only prevents pinch zoom
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    document.addEventListener("touchmove", preventZoom, { passive: false })

    return () => {
      document.removeEventListener("touchmove", preventZoom)
    }
  }, [])

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear any previous errors when user makes changes
    setError(null)
  }

  const goToNextStep = () => {
    // Clear any previous errors
    setError(null)

    switch (currentStep) {
      case "name":
        setCurrentStep("persona")
        break
      case "persona":
        setCurrentStep("introduction")
        break
      case "introduction":
        setCurrentStep("socials")
        break
      case "socials":
        handleSubmit()
        break
    }
  }

  const goToPreviousStep = () => {
    // Clear any previous errors
    setError(null)

    switch (currentStep) {
      case "persona":
        setCurrentStep("name")
        break
      case "introduction":
        setCurrentStep("persona")
        break
      case "socials":
        setCurrentStep("introduction")
        break
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Submit to MongoDB using server action
      const result = await submitToWaitlist(formData)
      setSubmissionStatus(result)

      if (result.success) {
        // Show success state
        setCurrentStep("success")
      } else {
        // Show error message
        setError(result.message)
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isNextDisabled = () => {
    switch (currentStep) {
      case "name":
        return !formData.name.trim()
      case "persona":
        return !formData.persona
      case "introduction":
        return !formData.introduction.trim()
      case "socials":
        // At least one social media handle should be provided
        return !(formData.instagram.trim() || formData.linkedin.trim() || formData.other.trim())
      default:
        return false
    }
  }

  const goToHome = () => {
    router.push("/")
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-white touch-none">
      {/* Background animation */}
      <CanvasAnimation />

      {/* Header with logo */}
      <div className="fixed top-4 sm:top-6 left-0 right-0 text-center z-10">
        <Link href="/">
          <div className="relative w-[100px] h-[25px] sm:w-[120px] sm:h-[30px] mx-auto">
            <Image src="/images/logo.png" alt="Suprslay" fill style={{ objectFit: "contain" }} priority />
          </div>
        </Link>
      </div>

      {/* Main content - fixed position with no scrolling */}
      <div className="fixed inset-0 flex items-center justify-center z-20 p-3 sm:p-4 pt-16 sm:pt-20 overflow-hidden touch-none">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden"
              style={{ maxHeight: "calc(100vh - 100px)" }}
            >
              {/* Card header */}
              <div className="p-4 sm:p-6 text-white" style={{ backgroundColor: "#e43d12" }}>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {currentStep === "success" ? "You're In!" : "Join Waitlist"}
                </h2>
                <p className="opacity-90 mt-1 text-sm sm:text-base">
                  {currentStep === "success" ? "We'll be in touch soon" : "Tell us about yourself"}
                </p>
              </div>

              {/* Card content - with fixed height and no scrolling */}
              <div className="p-4 sm:p-6">
                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs sm:text-sm">
                    {error}
                  </div>
                )}

                {/* Render the appropriate step component */}
                {currentStep === "name" && (
                  <StepName value={formData.name} onChange={(value) => updateFormData("name", value)} />
                )}

                {currentStep === "persona" && (
                  <StepPersona
                    value={formData.persona}
                    onChange={(value) => updateFormData("persona", value as "influencer" | "brand" | "")}
                  />
                )}

                {currentStep === "introduction" && (
                  <StepIntroduction
                    introduction={formData.introduction}
                    website={formData.website}
                    onIntroductionChange={(value) => updateFormData("introduction", value)}
                    onWebsiteChange={(value) => updateFormData("website", value)}
                  />
                )}

                {currentStep === "socials" && (
                  <StepSocials
                    instagram={formData.instagram}
                    linkedin={formData.linkedin}
                    other={formData.other}
                    onInstagramChange={(value) => updateFormData("instagram", value)}
                    onLinkedinChange={(value) => updateFormData("linkedin", value)}
                    onOtherChange={(value) => updateFormData("other", value)}
                  />
                )}

                {currentStep === "success" && <StepSuccess name={formData.name} />}

                {/* Navigation buttons */}
                <Navigation
                  currentStep={currentStep}
                  isNextDisabled={isNextDisabled()}
                  isSubmitting={isSubmitting}
                  onNext={goToNextStep}
                  onBack={goToPreviousStep}
                  onHome={goToHome}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

