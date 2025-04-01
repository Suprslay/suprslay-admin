import { getWaitlistEntries } from "@/lib/waitlist"

export default async function WaitlistAdmin() {
  // Get all waitlist entries
  const entries = await getWaitlistEntries()

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Waitlist Entries</h1>

      {/* Debug info - with very small font */}
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <p>Total entries found: {entries.length}</p>
        <p className="text-[8px] text-gray-500">
          If you're seeing this message but no entries below, there might be an issue with data formatting.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Persona
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Introduction
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Website
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Social Media
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entry.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.persona || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{entry.introduction || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.website ? (
                      <a
                        href={entry.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {entry.website}
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-1">
                      {entry.instagram && <div>Instagram: @{entry.instagram}</div>}
                      {entry.linkedin && <div>LinkedIn: {entry.linkedin}</div>}
                      {entry.other && <div>Other: {entry.other}</div>}
                      {!entry.instagram && !entry.linkedin && !entry.other && (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.createdAt ? (
                      <span title={entry.createdAt}>{new Date(entry.createdAt).toLocaleDateString()}</span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))}

              {entries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No waitlist entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw data for debugging */}
      <details className="mt-8 p-4 bg-gray-100 rounded-lg">
        <summary className="cursor-pointer font-medium">Debug: Raw Data</summary>
        <pre className="mt-2 p-4 bg-gray-800 text-white rounded-lg overflow-auto text-xs">
          {JSON.stringify(entries, null, 2)}
        </pre>
      </details>
    </div>
  )
}

