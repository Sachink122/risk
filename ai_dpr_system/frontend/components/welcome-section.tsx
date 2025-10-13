'use client'

import { useTranslation } from 'react-i18next'

export function WelcomeSection() {
  const { t } = useTranslation()
  
  return (
    <section className="py-12 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
            {t('common.appTitle')}
          </h1>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
            {t('common.ministry')}
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#dashboard"
              className="px-6 py-3 text-sm font-medium text-white rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('nav.dashboard')}
            </a>
            <a
              href="#upload"
              className="px-6 py-3 text-sm font-medium border rounded-md text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('dpr.upload')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}