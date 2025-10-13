// This file exports the i18n instance for direct imports in other files
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'

// Supported languages
export const supportedLanguages = ['en', 'hi', 'as']

// Default namespace
const defaultNS = 'common'

// Initialize i18next
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
      defaultNS,
      load: 'languageOnly', // Avoid region-specific codes (en-US -> en)
      keySeparator: false, // Handle keys with dots - important for nested translations
      // Don't load resources here, we're using the backend
      detection: {
        // Order of detection
        order: ['localStorage', 'querystring', 'navigator', 'htmlTag'],
        // Cache language in localStorage
        caches: ['localStorage'],
        // LocalStorage key
        lookupLocalStorage: 'dprAiLanguage',
        // Query string parameter
        lookupQuerystring: 'lang',
      },
      interpolation: {
        escapeValue: false, // Not needed for React
      },
      react: {
        useSuspense: false // Prevents issues during server-side rendering
      }
    })
}

export default i18next