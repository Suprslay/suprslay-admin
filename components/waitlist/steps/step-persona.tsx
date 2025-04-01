"use client"

interface StepPersonaProps {
  value: string
  onChange: (value: string) => void
}

export default function StepPersona({ value, onChange }: StepPersonaProps) {
  return (
    <div>
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Are you an influencer or a brand?</h3>
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className={value === "influencer" ? "shimmer-active" : ""}>
          <button
            onClick={() => onChange("influencer")}
            className={`p-3 sm:p-4 border rounded-lg text-left transition-all w-full ${
              value === "influencer" ? "border-[#e43d12] bg-[#e43d12]/10" : "border-gray-300 hover:border-[#e43d12]/50"
            }`}
          >
            <div className="font-medium text-sm sm:text-base">Influencer</div>
            <div className="text-xs sm:text-sm text-gray-500">I create content and have an audience</div>
          </button>
        </div>

        <div className={value === "brand" ? "shimmer-active" : ""}>
          <button
            onClick={() => onChange("brand")}
            className={`p-3 sm:p-4 border rounded-lg text-left transition-all w-full ${
              value === "brand" ? "border-[#e43d12] bg-[#e43d12]/10" : "border-gray-300 hover:border-[#e43d12]/50"
            }`}
          >
            <div className="font-medium text-sm sm:text-base">Brand</div>
            <div className="text-xs sm:text-sm text-gray-500">I represent a company or product</div>
          </button>
        </div>
      </div>
    </div>
  )
}

