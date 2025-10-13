'use client'

import { useEffect } from 'react'
import i18next from 'i18next'
import { initReactI18next, I18nextProvider } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'

// Supported languages
export const supportedLanguages = ['en', 'hi', 'as'] // English, Hindi, Assamese

// Language names for UI
export const languageNames = {
  en: 'English',
  hi: 'हिन्दी',
  as: 'অসমীয়া'
}

// Default namespace
const defaultNS = 'common'

// Initialize i18next if it hasn't been already
if (!i18next.isInitialized) {
  i18next
    // Load translations from /public/locales
    .use(resourcesToBackend((language: string, namespace: string) => 
      import(`@/public/locales/${language}/${namespace}.json`)
    ))
    // Detect user language
    .use(LanguageDetector)
    // Pass i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize
    .init({
      lng: 'en', // Default language
      fallbackLng: 'en',
      supportedLngs: supportedLanguages,
      ns: [defaultNS],
      defaultNS: defaultNS,
      load: 'languageOnly', // Avoid region-specific codes (en-US -> en)
      // Enable debugging in development
      debug: process.env.NODE_ENV === 'development',
      // Important - specify the namespace format to avoid issues
      keySeparator: '.',  // Important - use dot as separator
      nsSeparator: ':',   // Important - use colon as namespace separator
      // Don't load resources here, we're using the backend
      detection: {
        // Order of detection - try localStorage first, then navigator, then fallback
        order: ['querystring', 'localStorage', 'cookie', 'navigator', 'htmlTag'],
        // Cache language in multiple locations for reliability
        caches: ['localStorage', 'cookie'],
        // LocalStorage keys - check both our custom key and i18next default
        lookupLocalStorage: 'dprAiLanguage',
        lookupCookie: 'i18next',
        // Query string parameter - highest priority for explicit user choice
        lookupQuerystring: 'lang',
        // Cookie options
        cookieMinutes: 60 * 24 * 365, // 1 year
      },
      interpolation: {
        // Not needed for React
        escapeValue: false,
      },
      react: {
        useSuspense: false // Prevents issues during server-side rendering
      }
    })
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Immediately check for and apply stored language
    const initializeLanguage = () => {
      try {
        // Check URL query parameter first (highest priority)
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        
        // Attempt to load initial language with multiple fallbacks
        let storedLang = 
          urlLang ||
          localStorage.getItem('dprAiLanguage') || 
          localStorage.getItem('i18nextLng') ||
          document.cookie.split('; ').find(row => row.startsWith('i18next='))?.split('=')[1] ||
          navigator.language?.split('-')[0];
        
        // Validate the language or use default
        if (!storedLang || !supportedLanguages.includes(storedLang)) {
          storedLang = 'en'; // Default language
        }
        
        // Ensure consistent storage across all mechanisms
        localStorage.setItem('dprAiLanguage', storedLang);
        localStorage.setItem('i18nextLng', storedLang);
        document.cookie = `i18next=${storedLang}; path=/; max-age=${60 * 60 * 24 * 365}`;
        
        // Apply the language immediately
        i18next.changeLanguage(storedLang).then(() => {
          // Set HTML lang attribute for SEO and accessibility
          document.documentElement.setAttribute('lang', storedLang);
          
          // Set the document direction based on language
          const isRTL = ['ar', 'ur', 'he', 'fa'].includes(storedLang);
          document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
          
          console.log(`Language initialized to: ${storedLang}`);
        }).catch(err => {
          console.error('Failed to initialize language:', err);
        });
      } catch (error) {
        console.error('Error during language initialization:', error);
      }
    }
    
    // Run initialization
    if (typeof window !== 'undefined') {
      initializeLanguage()
    }
    
    // Helper function to synchronize language across all storage mechanisms
    const syncLanguagePreferences = (lng: string) => {
      if (typeof window === 'undefined' || !lng) return;
      
      try {
        // Only store valid languages
        if (!supportedLanguages.includes(lng)) return;
        
        // Update all storage mechanisms
        localStorage.setItem('dprAiLanguage', lng);
        localStorage.setItem('i18nextLng', lng);
        document.cookie = `i18next=${lng}; path=/; max-age=${60 * 60 * 24 * 365}`;
        
        // Update HTML attributes
        document.documentElement.setAttribute('lang', lng);
        const isRTL = ['ar', 'ur', 'he', 'fa'].includes(lng);
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        
        console.log(`Language preferences synchronized to: ${lng}`);
      } catch (error) {
        console.error('Error synchronizing language preferences:', error);
      }
    }
    
    // Set up language change listener
    const handleLanguageChanged = (lng: string) => {
      console.log(`Language changed to ${lng}`);
      syncLanguagePreferences(lng);
    }
    
    i18next.on('languageChanged', handleLanguageChanged);
    
    // Check for language changes on window focus or visibility change
    const handleVisibilityOrFocus = () => {
      const currentLng = i18next.language;
      const storedLng = localStorage.getItem('dprAiLanguage') || 
                        localStorage.getItem('i18nextLng');
      
      if (storedLng && storedLng !== currentLng && supportedLanguages.includes(storedLng)) {
        console.log(`Language mismatch detected. Applying stored language: ${storedLng}`);
        i18next.changeLanguage(storedLng);
      }
    };
    
    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    
    return () => {
      i18next.off('languageChanged', handleLanguageChanged);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    }
  }, [])

  return (
    <I18nextProvider i18n={i18next}>
      {children}
    </I18nextProvider>
  )
}