import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import LangAttribute from '@/components/lang-attribute'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DPR-AI | Ministry of Development of North Eastern Region',
  description: 'AI-powered system for DPR evaluation and risk assessment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {/* Update <html> lang/dir attributes on the client without rendering them here */}
          <LangAttribute>
            {children}
          </LangAttribute>
        </Providers>
      </body>
    </html>
  )
}