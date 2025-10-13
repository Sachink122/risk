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
    <LangAttribute>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </LangAttribute>
  )
}