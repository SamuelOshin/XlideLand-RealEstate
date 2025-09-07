'use client'

import { useState } from 'react'
import { propertiesAPI, dashboardAPI } from '@/lib/api'

export default function APITestPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    setTestResults([])
    
    const tests = [
      {
        name: 'Get Properties',
        test: () => propertiesAPI.getProperties(),
      },
      {
        name: 'Get Dashboard Stats',
        test: () => dashboardAPI.getStats(),
      },
    ]

    for (const { name, test } of tests) {
      try {
        // Debug info only in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🧪 Running test: ${name}`)
        }
        const result = await test()
        // Debug info only in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Test passed: ${name}`, result)
        }
        setTestResults(prev => [...prev, { name, status: 'success', data: result }])      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        console.error(`❌ Test failed: ${name}`, error)
        setTestResults(prev => [...prev, { name, status: 'error', error: errorMessage }])
      }
    }
    
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Connectivity Test</h1>
      
      <div className="mb-6">
        <button 
          onClick={runTests}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Run API Tests'}
        </button>
      </div>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${
              result.status === 'success' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <h3 className="font-semibold mb-2">
              {result.status === 'success' ? '✅' : '❌'} {result.name}
            </h3>
            {result.status === 'success' ? (
              <pre className="text-sm text-gray-600 overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            ) : (
              <p className="text-red-600">{result.error}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Open browser Developer Tools (F12)</li>
          <li>Go to the Console tab</li>
          <li>Click "Run API Tests" above</li>
          <li>Watch for API logs in the console</li>
          <li>Check if requests are being sent and responses received</li>
        </ol>
      </div>
    </div>
  )
}
