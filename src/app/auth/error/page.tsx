'use client'

import { useSearchParams } from 'next/navigation'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error || 'An error occurred during authentication'}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error Details
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify({ error }, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <a
              href="/"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 