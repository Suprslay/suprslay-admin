"use client"

import type React from "react"

import { useState } from "react"
import { put } from "@vercel/blob"

export default function BlobUploader() {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setUploading(true)
    const newFiles = []

    try {
      for (const file of Array.from(e.target.files)) {
        // Determine the appropriate folder based on file type
        let folder = "assets"
        if (file.type.startsWith("video/")) folder = "videos"
        if (file.type.startsWith("audio/")) folder = "audio"
        if (file.type.startsWith("image/")) folder = "images"

        // Upload to Vercel Blob
        const { url } = await put(`${folder}/${file.name}`, file, {
          access: "public",
          contentType: file.type,
        })

        console.log(`Uploaded ${file.name} to ${url}`)
        newFiles.push({ name: file.name, url })
      }

      setUploadedFiles((prev) => [...prev, ...newFiles])
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed. See console for details.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Media to Vercel Blob</h1>

      <div className="mb-6">
        <label className="block mb-2">Select files to upload:</label>
        <input
          type="file"
          multiple
          onChange={handleUpload}
          disabled={uploading}
          className="border p-2 w-full"
          accept="video/*,audio/*,image/*"
        />
        {uploading && <p className="mt-2">Uploading...</p>}
      </div>

      {uploadedFiles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">File Name</th>
                  <th className="p-3 text-left">URL</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">{file.name}</td>
                    <td className="p-3 break-all">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {file.url}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-semibold text-yellow-800">Copy these URLs for your constants file:</h3>
            <pre className="mt-2 p-3 bg-gray-800 text-white rounded-md overflow-x-auto text-sm">
              {`// Video URLs
export const FINAL_VIDEO_URL_DESKTOP = "${uploadedFiles.find((f) => f.name.includes("desktop"))?.url || "[Desktop Video URL]"}";
export const FINAL_VIDEO_URL_MOBILE = "${uploadedFiles.find((f) => f.name.includes("mobile"))?.url || "[Mobile Video URL]"}";

// Background music URL
export const BACKGROUND_MUSIC_URL = "${uploadedFiles.find((f) => f.name.includes(".mp3"))?.url || "[Audio URL]"}";`}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

