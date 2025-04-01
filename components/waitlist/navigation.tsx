"use client"

import type { FormStep } from "./types"

interface NavigationProps {
  currentStep: FormStep
  isNextDisabled: boolean
  isSubmitting: boolean
  onNext: () => void
  onBack: () => void
  onHome?: () => void
}

export default function Navigation({
  currentStep,
  isNextDisabled,
  isSubmitting,
  onNext,
  onBack,
  onHome,
}: NavigationProps) {
  if (currentStep === "success" && onHome) {
    return (
      <div className="flex justify-center mt-4 sm:mt-8">
        <button
          onClick={onHome}
          className="px-4 py-1.5 sm:px-6 sm:py-2 rounded-lg text-white transition-all hover:shadow-lg text-sm sm:text-base"
          style={{ backgroundColor: "#e43d12" }}
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="flex justify-between mt-4 sm:mt-8">
      {currentStep !== "name" ? (
        <button
          onClick={onBack}
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
        >
          Back
        </button>
      ) : (
        <div></div> // Empty div to maintain flex spacing
      )}

      <button
        onClick={onNext}
        disabled={isNextDisabled || isSubmitting}
        className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-lg text-white transition-all text-sm sm:text-base ${
          isNextDisabled || isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
        }`}
        style={{
          backgroundColor: "#e43d12",
        }}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-1.5 h-3 w-3 sm:h-4 sm:w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Submitting
          </span>
        ) : currentStep === "socials" ? (
          "Submit"
        ) : (
          "Next"
        )}
      </button>
    </div>
  )
}

