"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import clientPromise from "@/lib/mongodb"
import type { FormData } from "@/components/waitlist/types"

// Define a schema for validation
const waitlistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  persona: z.enum(["influencer", "brand"]),
  introduction: z.string().min(1, "Introduction is required"),
  website: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  other: z.string().optional(),
  createdAt: z.date().optional(),
})

export type WaitlistFormData = z.infer<typeof waitlistSchema>

export async function submitToWaitlist(formData: FormData) {
  try {
    // Validate the form data
    const validatedData = waitlistSchema.parse({
      ...formData,
      createdAt: new Date(),
    })

    // Ensure at least one social media handle is provided
    if (!validatedData.instagram && !validatedData.linkedin && !validatedData.other) {
      return {
        success: false,
        message: "Please provide at least one social media handle",
      }
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("suprslay")

    // Prepare the document to insert
    const documentToInsert = {
      ...validatedData,
      // Ensure createdAt is a proper Date object
      createdAt: new Date(),
    }

    console.log("Inserting document:", documentToInsert)

    // Insert the data into the waitlist collection
    const result = await db.collection("waitlist").insertOne(documentToInsert)

    if (result.acknowledged) {
      // Revalidate the path to update any data
      revalidatePath("/join")
      revalidatePath("/admin/waitlist")

      return {
        success: true,
        message: "Successfully added to waitlist!",
      }
    } else {
      return {
        success: false,
        message: "Failed to add to waitlist. Please try again.",
      }
    }
  } catch (error) {
    console.error("Waitlist submission error:", error)

    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((err) => `${err.path}: ${err.message}`).join(", ")
      return {
        success: false,
        message: `Validation error: ${errorMessage}`,
      }
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}

