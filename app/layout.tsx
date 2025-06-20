import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/navbar'
import { Toaster } from "sonner"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StarCast',
  description: 'Space Tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-b from-[rgb(10,10,20)] via-[rgb(40,40,50)] to-[rgb(10,10,20)]">
            <Navbar />
            {children}
          </div>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  )
}
