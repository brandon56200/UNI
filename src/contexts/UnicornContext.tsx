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

  // Load saved unicorns from localStorage on mount
  useEffect(() => {
    const loadSavedUnicorns = () => {
      try {
        const saved = localStorage.getItem('savedUnicorns')
        if (saved) {
          setSavedUnicorns(JSON.parse(saved))
        }
      } catch (err) {
        console.error('Error loading saved unicorns:', err)
      }
    }

    loadSavedUnicorns()
  }, [])

  // Save unicorns to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedUnicorns', JSON.stringify(savedUnicorns))
  }, [savedUnicorns])

  // Save favorites state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('showFavorites', JSON.stringify(showFavorites))
  }, [showFavorites])

  // Load favorites state from localStorage on mount
  useEffect(() => {
    const loadFavoritesState = () => {
      try {
        const saved = localStorage.getItem('showFavorites')
        if (saved) {
          setShowFavorites(JSON.parse(saved))
        }
      } catch (err) {
        console.error('Error loading favorites state:', err)
      }
    }

    loadFavoritesState()
  }, [])

  const addUnicorn = async (company: string) => {
    if (!session?.user?.email) return;
    
    try {
      setError(null);
      
      // Add locally first for immediate UI feedback
      const updatedUnicorns = [...savedUnicorns];
      if (!updatedUnicorns.includes(company)) {
        updatedUnicorns.push(company);
      }
      
      // Update API
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savedUnicorns: updatedUnicorns })
      });
      
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      
      // Set from API response to ensure consistency
      setSavedUnicorns(result.savedUnicorns);
    } catch (err) {
      console.error('Error adding unicorn:', err);
      setError('Failed to save unicorn');
      // Refresh to get consistent state
      refreshUnicorns();
    }
  };

  const removeUnicorn = async (company: string) => {
    if (!session?.user?.email) return;
    
    try {
      setError(null);
      
      // Remove locally first for immediate UI feedback
      const updatedUnicorns = savedUnicorns.filter(name => name !== company);
      
      // Update API
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savedUnicorns: updatedUnicorns })
      });
      
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      
      // Set from API response to ensure consistency
      setSavedUnicorns(result.savedUnicorns);
    } catch (err) {
      console.error('Error removing unicorn:', err);
      setError('Failed to remove unicorn');
      // Refresh to get consistent state
      refreshUnicorns();
    }
  };

  const refreshUnicorns = async () => {
    if (!session?.user?.email) return;
    
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
      setError(err instanceof Error ? err.message : 'An error occurred')
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