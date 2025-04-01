import clientPromise from "./mongodb"

export type WaitlistEntry = {
  _id: string
  name: string
  persona: "influencer" | "brand" | string
  introduction: string
  website?: string
  instagram?: string
  linkedin?: string
  other?: string
  createdAt: string
}

export async function getWaitlistEntries(): Promise<WaitlistEntry[]> {
  try {
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("suprslay")

    // Get all waitlist entries, sorted by newest first
    const waitlistEntries = await db.collection("waitlist").find({}).sort({ createdAt: -1 }).toArray()

    // Convert MongoDB documents to plain objects and handle date conversion
    const entries = waitlistEntries.map((entry) => {
      // Convert MongoDB document to plain object
      const plainEntry = JSON.parse(JSON.stringify(entry))

      // Ensure _id is a string
      plainEntry._id = entry._id.toString()

      // Handle date conversion if needed
      if (plainEntry.createdAt) {
        // Try to ensure createdAt is a proper date object or string
        try {
          plainEntry.createdAt = new Date(plainEntry.createdAt).toISOString()
        } catch (e) {
          console.error("Error converting date:", e)
          plainEntry.createdAt = String(plainEntry.createdAt)
        }
      }

      return plainEntry
    })

    return entries
  } catch (error) {
    console.error("Error fetching waitlist entries:", error)
    return []
  }
}

