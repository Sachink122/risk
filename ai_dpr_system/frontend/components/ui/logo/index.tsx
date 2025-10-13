'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  // Size mapping
  const sizeMap = {
    sm: { logo: 32, text: 'text-lg' },
    md: { logo: 40, text: 'text-xl' },
    lg: { logo: 48, text: 'text-2xl' }
  }
  
  const { logo, text } = sizeMap[size]
  
  return (
    <Link 
      href="/"
      className={`flex items-center gap-2 ${className}`}
    >
      <div className="relative">
        <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-dpr-ai-primary to-dpr-ai-blue-700 p-1.5 shadow-md">
          <span className="text-white font-bold font-heading">
            AI
          </span>
        </div>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dpr-ai-secondary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-dpr-ai-secondary"></span>
        </span>
      </div>
      
      {showText && (
        <div className={`font-heading font-bold ${text} tracking-tight`}>
          <span className="text-dpr-ai-primary">DPR</span>
          <span className="text-dpr-ai-secondary">-AI</span>
        </div>
      )}
    </Link>
  )
}
