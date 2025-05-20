import type { Metadata } from "next";
import "./globals.css";
import { UnicornProvider } from '@/contexts/UnicornContext'
import { FilterProvider } from '@/contexts/FilterContext'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'
import { UnicornsProvider } from '@/contexts/UnicornsContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "UNI",
  description: "Find your next unicorn",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-screen w-screen overflow-hidden" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <UnicornsProvider>
            <UnicornProvider>
              <FilterProvider>
                <div className="w-full h-full overflow-hidden">
                  {children}
                </div>
              </FilterProvider>
            </UnicornProvider>
          </UnicornsProvider>
        </Providers>
      </body>
    </html>
  );
}
