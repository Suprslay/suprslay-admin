"use client"

import type { ChangeEvent } from "react"

interface StepNameProps {
  value: string
  onChange: (value: string) => void
}

export default function StepName({ value, onChange }: StepNameProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">What's your name?</h3>
      <div className="shimmer-input-wrapper">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Enter your full name"
          className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e43d12] bg-white text-base"
          autoFocus
        />
      </div>
    </div>
  )
}

