import type { Metadata } from "next";
import "./globals.css";
import { UnicornProvider } from '@/contexts/UnicornContext'
import { FilterProvider } from '@/contexts/FilterContext'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { UnicornsProvider } from '@/contexts/UnicornsContext'
import ClientLayout from '@/components/ClientLayout'
import '@/styles/animations.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "UNI",
  description: "Find your next unicorn",
  icons: {
    icon: "/favicon.png"
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
                <ClientLayout>
                  {children}
                </ClientLayout>
              </FilterProvider>
            </UnicornProvider>
          </UnicornsProvider>
        </Providers>
      </body>
    </html>
  );
}
