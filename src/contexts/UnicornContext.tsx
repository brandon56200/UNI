'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

type UnicornContextType = {
  savedUnicorns: string[]
  isLoading: boolean
  error: string | null
  addUnicorn: (unicornName: string) => Promise<void>
  removeUnicorn: (unicornName: string) => Promise<void>
  refreshUnicorns: () => Promise<void>
}

const UnicornContext = createContext<UnicornContextType | undefined>(undefined)

export function UnicornProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [savedUnicorns, setSavedUnicorns] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const refreshUnicorns = async () => {
    if (!session?.user?.email || status !== 'authenticated') return
    
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/user')
      const data = await response.json()
      
      setSavedUnicorns(data.savedUnicorns)
      console.log('Unicorns refreshed:', data.savedUnicorns)
    } catch (err) {
      console.error('Error refreshing unicorns:', err)
      setError('Failed to load saved unicorns')
    } finally {
      setIsLoading(false)
    }
  }

  const addUnicorn = async (unicornName: string) => {
    if (!session?.user?.email) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      // Add locally first for immediate UI feedback
      const updatedUnicorns = [...savedUnicorns]
      if (!updatedUnicorns.includes(unicornName)) {
        updatedUnicorns.push(unicornName)
      }
      
      // Update API
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savedUnicorns: updatedUnicorns })
      })
      
      const result = await response.json()
      if (result.error) throw new Error(result.error)
      
      // Set from API response to ensure consistency
      setSavedUnicorns(result.savedUnicorns)
      console.log('Unicorn added:', unicornName)
    } catch (err) {
      console.error('Error adding unicorn:', err)
      setError('Failed to save unicorn')
      // Refresh to get consistent state
      refreshUnicorns()
    } finally {
      setIsLoading(false)
    }
  }

  const removeUnicorn = async (unicornName: string) => {
    if (!session?.user?.email) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      // Remove locally first for immediate UI feedback
      const updatedUnicorns = savedUnicorns.filter(name => name !== unicornName)
      
      // Update API
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savedUnicorns: updatedUnicorns })
      })
      
      const result = await response.json()
      if (result.error) throw new Error(result.error)
      
      // Set from API response to ensure consistency
      setSavedUnicorns(result.savedUnicorns)
      console.log('Unicorn removed:', unicornName)
    } catch (err) {
      console.error('Error removing unicorn:', err)
      setError('Failed to remove unicorn')
      // Refresh to get consistent state
      refreshUnicorns()
    } finally {
      setIsLoading(false)
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

  return (
    <UnicornContext.Provider value={{
      savedUnicorns,
      isLoading,
      error,
      addUnicorn,
      removeUnicorn,
      refreshUnicorns
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