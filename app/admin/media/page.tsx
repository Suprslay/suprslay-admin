import { list, del } from "@vercel/blob"

export default async function MediaManager() {
  // List all blobs
  const { blobs } = await list()

  // Group by type
  const videos = blobs.filter((blob) => blob.pathname.startsWith("videos/"))
  const audio = blobs.filter((blob) => blob.pathname.startsWith("audio/"))
  const images = blobs.filter((blob) => blob.pathname.startsWith("images/"))

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Media Manager</h1>

      <h2 className="text-xl font-semibold mt-6 mb-4">Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((blob) => (
          <div key={blob.pathname} className="border p-4 rounded">
            <video src={blob.url} className="w-full h-48 object-cover mb-2" controls />
            <p className="truncate">{blob.pathname}</p>
            <p className="text-sm text-gray-500">{new Date(blob.uploadedAt).toLocaleString()}</p>
            <form
              action={async () => {
                "use server"
                await del(blob.url)
              }}
            >
              <button type="submit" className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>

      {/* Similar sections for audio and images */}
    </div>
  )
}

