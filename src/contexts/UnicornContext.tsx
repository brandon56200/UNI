'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

interface UnicornContextType {
  savedUnicorns: string[]
  isLoading: boolean
  error: string | null
  addUnicorn: (company: string) => void
  removeUnicorn: (company: string) => void
  refreshUnicorns: () => Promise<void>
  showFavorites: boolean
  setShowFavorites: (show: boolean) => void
}

const UnicornContext = createContext<UnicornContextType | undefined>(undefined)

export function UnicornProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [savedUnicorns, setSavedUnicorns] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showFavorites, setShowFavorites] = useState(false)

  const refreshUnicorns = async () => {
    if (!session?.user?.email) {
      setSavedUnicorns([])
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/user')
      if (!response.ok) {
        throw new Error('Failed to fetch saved unicorns')
      }
      const data = await response.json()
      setSavedUnicorns(data.savedUnicorns || [])
    } catch (err) {
      console.error('Error fetching saved unicorns:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const addUnicorn = async (company: string) => {
    if (!session?.user?.email) return
    
    try {
      setError(null)
      
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savedUnicorns: [...savedUnicorns, company] })
      })
      
      if (!response.ok) {
        throw new Error('Failed to save unicorn')
      }
      
      const data = await response.json()
      setSavedUnicorns(data.savedUnicorns || [])
    } catch (err) {
      console.error('Error adding unicorn:', err)
      setError('Failed to save unicorn')
      refreshUnicorns() // Refresh to ensure consistent state
    }
  }

  const removeUnicorn = async (company: string) => {
    if (!session?.user?.email) return
    
    try {
      setError(null)
      
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          savedUnicorns: savedUnicorns.filter(name => name !== company)
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to remove unicorn')
      }
      
      const data = await response.json()
      setSavedUnicorns(data.savedUnicorns || [])
    } catch (err) {
      console.error('Error removing unicorn:', err)
      setError('Failed to remove unicorn')
      refreshUnicorns() // Refresh to ensure consistent state
    }
  }

  // Load initial data when session changes
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      refreshUnicorns()
    } else if (status === 'unauthenticated') {
      setSavedUnicorns([])
      setIsLoading(false)
    }
  }, [session, status])

  // Periodically refresh saved unicorns while authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const interval = setInterval(refreshUnicorns, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [session, status])

  return (
    <UnicornContext.Provider value={{
      savedUnicorns,
      isLoading,
      error,
      addUnicorn,
      removeUnicorn,
      refreshUnicorns,
      showFavorites,
      setShowFavorites
    }}>
      {children}
    </UnicornContext.Provider>
  )
}

export function useUnicorn() {
  const context = useContext(UnicornContext)
  if (context === undefined) {
    throw new Error('useUnicorn must be used within a UnicornProvider')
  }
  return context
} 