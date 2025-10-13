'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { usePathname } from 'next/navigation'

/**
 * This component listens for language changes and updates the HTML language attribute.
 * It also provides a global event listener for other components to respond to language changes.
 * Enhanced to handle route changes and persist language settings.
 */
export function LanguageChangeHandler() {
  const { i18n } = useTranslation()
  const pathname = usePathname()
  
  useEffect(() => {
    // Function to update the HTML lang attribute and document direction
    const updateHtmlLang = (lang: string) => {
      if (typeof window !== 'undefined' && window.document) {
        document.documentElement.setAttribute('lang', lang)
        
        // Set the document direction based on language
        // For RTL languages like Arabic, Urdu, etc.
        const isRTL = ['ar', 'ur', 'he', 'fa'].includes(lang)
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
        
        // Store the language in localStorage for persistence
        localStorage.setItem('dprAiLanguage', lang)
        
        // Also dispatch a custom event that components can listen to
        window.dispatchEvent(
          new CustomEvent('languageChanged', { detail: { language: lang } })
        )
      }
    }
    
    // Set up language change listener
    const handleLanguageChanged = (lng: string) => {
      updateHtmlLang(lng)
    }
    
    // Set initial language
    updateHtmlLang(i18n.language || 'en')
    
    // Add event listener
    i18n.on('languageChanged', handleLanguageChanged)
    
    // Clean up
    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [i18n, pathname])
  
  // This is a utility component that doesn't render anything
  return null
}