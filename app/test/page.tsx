export default function AdminTest() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test Page</h1>
      <p className="text-green-600 font-medium">If you can see this page, you are successfully authenticated!</p>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="font-semibold mb-2">Debug Information</h2>
        <p>This page is protected by authentication middleware.</p>
        <p>Current time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  )
}

