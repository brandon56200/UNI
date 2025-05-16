'use client'

import { useUnicorn } from "@/contexts/UnicornContext"
import { useSession } from "next-auth/react"

export default function UnicornList() {
  const { data: session } = useSession()
  const { savedUnicorns, isLoading, error, addUnicorn, removeUnicorn } = useUnicorn()

  if (!session) {
    return <p className="text-sm text-gray-500">Sign in to manage your unicorns</p>
  }

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading unicorns...</p>
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Your Saved Unicorns</h3>
      
      {savedUnicorns.length === 0 ? (
        <p className="text-sm text-gray-500">You haven't saved any unicorns yet</p>
      ) : (
        <ul className="space-y-2">
          {savedUnicorns.map((unicorn) => (
            <li key={unicorn} className="flex items-center justify-between">
              <span>{unicorn}</span>
              <button
                onClick={() => removeUnicorn(unicorn)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {/* Example of adding a new unicorn */}
      <div className="mt-4">
        <button
          onClick={() => addUnicorn(`Unicorn-${Math.floor(Math.random() * 1000)}`)}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Add Random Unicorn
        </button>
      </div>
    </div>
  )
} 