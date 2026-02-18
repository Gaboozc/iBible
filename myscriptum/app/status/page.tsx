'use client';

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-600 mb-2">✅ System Online</h1>
            <p className="text-gray-600 text-lg">iBible Application is Running</p>
          </div>

          <div className="bg-gray-50 rounded p-4 space-y-2">
            <h2 className="font-semibold text-gray-900">Status Checks:</h2>
            <p className="text-green-700">✓ Frontend rendering working</p>
            <p className="text-green-700">✓ React components loaded</p>
            <p className="text-green-700">✓ Page routing functional</p>
          </div>

          <div className="bg-blue-50 rounded p-4 space-y-2">
            <h2 className="font-semibold text-gray-900">Navigation:</h2>
            <ul className="space-y-2 text-blue-600">
              <li><a href="/home" className="hover:underline">→ Go to Home</a></li>
              <li><a href="/api/health" className="hover:underline">→ Check API Health</a></li>
              <li><a href="/api/verse-of-day" className="hover:underline">→ Get Verse of Day</a></li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded p-4">
            <p className="text-sm text-gray-700">
              If you see this page, the deployment is working. 
              If other pages show 404, there may be data loading issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
