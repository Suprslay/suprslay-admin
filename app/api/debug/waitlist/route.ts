import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("suprslay")

    // Get all waitlist entries
    const waitlistEntries = await db.collection("waitlist").find({}).toArray()

    // Convert MongoDB documents to plain objects
    const entries = waitlistEntries.map((entry) => {
      const plainEntry = { ...entry, _id: entry._id.toString() }
      return plainEntry
    })

    return NextResponse.json({
      success: true,
      count: entries.length,
      entries,
    })
  } catch (error) {
    console.error("Error fetching waitlist entries:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}

