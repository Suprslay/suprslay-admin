"use client"

import dynamic from "next/dynamic"

// Dynamically import the uploader component to avoid SSR issues with Blob
const BlobUploader = dynamic(() => import("../../../scripts/upload-to-blob"), {
  ssr: false,
})

export default function UploadPage() {
  return <BlobUploader />
}

