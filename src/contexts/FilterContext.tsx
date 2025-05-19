'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface FilterContextType {
  selectedCities: string[]
  selectedIndustries: string[]
  selectedInvestors: string[]
  setSelectedCities: (cities: string[]) => void
  setSelectedIndustries: (industries: string[]) => void
  setSelectedInvestors: (investors: string[]) => void
  clearAllFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([])

  const clearAllFilters = () => {
    setSelectedCities([])
    setSelectedIndustries([])
    setSelectedInvestors([])
  }

  return (
    <FilterContext.Provider
      value={{
        selectedCities,
        selectedIndustries,
        selectedInvestors,
        setSelectedCities,
        setSelectedIndustries,
        setSelectedInvestors,
        clearAllFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
} 