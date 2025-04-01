"use client"

import type { ChangeEvent } from "react"

interface StepIntroductionProps {
  introduction: string
  website: string
  onIntroductionChange: (value: string) => void
  onWebsiteChange: (value: string) => void
}

export default function StepIntroduction({
  introduction,
  website,
  onIntroductionChange,
  onWebsiteChange,
}: StepIntroductionProps) {
  const handleIntroductionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onIntroductionChange(e.target.value)
  }

  const handleWebsiteChange = (e: ChangeEvent<HTMLInputElement>) => {
    onWebsiteChange(e.target.value)
  }

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Introduce yourself</h3>

      <div className="space-y-2 sm:space-y-4">
        <div>
          <div className="shimmer-input-wrapper">
            <textarea
              value={introduction}
              onChange={handleIntroductionChange}
              placeholder="Tell us a bit about yourself or your brand..."
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e43d12] min-h-[80px] sm:min-h-[120px] bg-white text-base"
              autoFocus
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            What makes you unique? What are you looking for?
          </p>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Website (optional)</label>
          <div className="shimmer-input-wrapper">
            <input
              type="url"
              value={website}
              onChange={handleWebsiteChange}
              placeholder="https://yourwebsite.com"
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e43d12] bg-white text-base"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

