import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en';
import hiTranslations from './locales/hi';
import asTranslations from './locales/as';

// Create a singleton i18n instance that can be imported from anywhere
const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  },
  as: {
    translation: asTranslations
  }
};

// Initialize i18next with proper configuration
const i18n = i18next.createInstance();

// Default to English for SSR, client-side detection will happen through the detector
const defaultLanguage = 'en';

// Check if we're on the client side before using browser-specific features
const isClient = typeof window !== 'undefined';

// Always use initReactI18next regardless of environment
i18n.use(initReactI18next);

// Only use language detector on client side
if (isClient) {
  i18n.use(LanguageDetector);
}

// Initialize with safe configuration
i18n.init({
  resources,
  lng: defaultLanguage,
  fallbackLng: 'en',
  supportedLngs: ['en', 'hi', 'as'],
  interpolation: {
    escapeValue: false, // not needed for React
  },
  react: {
    useSuspense: false, // Important for SSR
    bindI18n: 'languageChanged loaded',
  },
  // This is important for SSR
  initImmediate: isClient ? false : true,
  // Language detection only happens on client side
  detection: isClient ? {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage']
  } : undefined
});

export default i18n;