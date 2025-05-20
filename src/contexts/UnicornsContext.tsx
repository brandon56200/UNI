'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Unicorn {
  City: string;
  Company: string;
  Country: string;
  'Date Joined': string;
  Industry: string;
  'Select Investors': string;
  'Valuation ($B)': number;
}

interface UnicornsContextType {
  allUnicorns: Unicorn[];
  isLoading: boolean;
  isDataReady: boolean;
  cityOptions: FilterOption[];
  industryOptions: FilterOption[];
  investorOptions: FilterOption[];
}

type FilterOption = {
  label: string;
  value: string;
}

const UnicornsContext = createContext<UnicornsContextType | undefined>(undefined)

export function UnicornsProvider({ children }: { children: ReactNode }) {
  const [allUnicorns, setAllUnicorns] = useState<Unicorn[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDataReady, setIsDataReady] = useState(false)
  const [cityOptions, setCityOptions] = useState<FilterOption[]>([])
  const [industryOptions, setIndustryOptions] = useState<FilterOption[]>([])
  const [investorOptions, setInvestorOptions] = useState<FilterOption[]>([])

  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 Starting to fetch unicorns data...')
      try {
        const response = await fetch('/api/unicorns?limit=1000')
        if (!response.ok) {
          throw new Error('Failed to fetch unicorns')
        }
        const data = await response.json()
        
        if (!data.unicorns) {
          throw new Error('Invalid response format')
        }
        
        console.log('✅ Unicorns data fetched successfully!')
        
        // Set all unicorns data
        setAllUnicorns(data.unicorns)
        
        // Extract unique values for each filter
        const cities = new Set<string>()
        const industries = new Set<string>()
        const investors = new Set<string>()

        data.unicorns.forEach((unicorn: Unicorn) => {
          if (unicorn.City) cities.add(unicorn.City)
          if (unicorn.Industry) industries.add(unicorn.Industry)
          if (unicorn['Select Investors']) {
            unicorn['Select Investors'].split(', ').forEach(investor => investors.add(investor))
          }
        })

        // Create and set filter options
        const cityOpts = Array.from(cities).sort().map(city => ({ label: city, value: city }))
        const industryOpts = Array.from(industries).sort().map(industry => ({ label: industry, value: industry }))
        const investorOpts = Array.from(investors).sort().map(investor => ({ label: investor, value: investor }))

        setCityOptions(cityOpts)
        setIndustryOptions(industryOpts)
        setInvestorOptions(investorOpts)

        setIsLoading(false)
        setIsDataReady(true)
        console.log('✨ Data processing complete, ready to render!')
      } catch (error) {
        console.error('❌ Error loading unicorns:', error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <UnicornsContext.Provider value={{
      allUnicorns,
      isLoading,
      isDataReady,
      cityOptions,
      industryOptions,
      investorOptions
    }}>
      {children}
    </UnicornsContext.Provider>
  )
}

export function useUnicorns() {
  const context = useContext(UnicornsContext)
  if (context === undefined) {
    throw new Error('useUnicorns must be used within a UnicornsProvider')
  }
  return context
} 