'use client'

import { SessionProvider } from "next-auth/react"
import { UnicornProvider } from "@/contexts/UnicornContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={0} 
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      <UnicornProvider>
        <div className="w-full h-full overflow-hidden">
          {children}
        </div>
      </UnicornProvider>
    </SessionProvider>
  )
} 