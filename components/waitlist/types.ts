export type FormStep = "name" | "persona" | "introduction" | "socials" | "success"

export type FormData = {
  name: string
  persona: "influencer" | "brand" | ""
  website: string
  introduction: string
  instagram: string
  linkedin: string
  other: string
}

export type SubmissionStatus = {
  success: boolean
  message: string
}

