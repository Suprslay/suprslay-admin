"use client"

import type { ChangeEvent } from "react"

interface StepSocialsProps {
  instagram: string
  linkedin: string
  other: string
  onInstagramChange: (value: string) => void
  onLinkedinChange: (value: string) => void
  onOtherChange: (value: string) => void
}

export default function StepSocials({
  instagram,
  linkedin,
  other,
  onInstagramChange,
  onLinkedinChange,
  onOtherChange,
}: StepSocialsProps) {
  const handleInstagramChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInstagramChange(e.target.value)
  }

  const handleLinkedinChange = (e: ChangeEvent<HTMLInputElement>) => {
    onLinkedinChange(e.target.value)
  }

  const handleOtherChange = (e: ChangeEvent<HTMLInputElement>) => {
    onOtherChange(e.target.value)
  }

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Your social media</h3>
      <div className="space-y-2 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Instagram</label>
          <div className="shimmer-input-wrapper flex">
            <span className="bg-gray-100 p-2.5 sm:p-3 rounded-l-lg text-gray-500 border border-gray-300 border-r-0 text-base">
              @
            </span>
            <input
              type="text"
              value={instagram}
              onChange={handleInstagramChange}
              placeholder="username"
              className="flex-1 p-2.5 sm:p-3 border border-gray-300 rounded-r-lg focus:outline-none focus:border-[#e43d12] bg-white text-base"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
          <div className="shimmer-input-wrapper">
            <input
              type="text"
              value={linkedin}
              onChange={handleLinkedinChange}
              placeholder="linkedin.com/in/username"
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e43d12] bg-white text-base"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Other (Twitter, YouTube, etc.)
          </label>
          <div className="shimmer-input-wrapper">
            <input
              type="text"
              value={other}
              onChange={handleOtherChange}
              placeholder="Full URL or @username"
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e43d12] bg-white text-base"
            />
          </div>
        </div>
      </div>
      <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-4">Please provide at least one social media handle</p>
    </div>
  )
}

