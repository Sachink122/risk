'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import i18next from 'i18next'

/**
 * A hook that returns the current language code for use in the html lang attribute
 * This helps with accessibility and SEO
 */
export function useLangAttribute(): string {
  const pathname = usePathname()
  const [lang, setLang] = useState<string>('en')
  
  useEffect(() => {
    // Get the current language from i18next
    const currentLang = i18next.language || 'en'
    setLang(currentLang)
    
    // Listen for language changes
    const handleLanguageChanged = (lng: string) => {
      setLang(lng)
    }
    
    i18next.on('languageChanged', handleLanguageChanged)
    
    return () => {
      i18next.off('languageChanged', handleLanguageChanged)
    }
  }, [pathname])
  
  return lang
}
