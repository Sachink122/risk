'use client'

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * A debugging component that displays the current language and translation status
 */
export function DebugLanguage() {
  const { t, i18n } = useTranslation()
  
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Language Debugger</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 text-sm">
          <div>
            <span className="font-medium">Current Language:</span> {i18n.language}
          </div>
          <div>
            <span className="font-medium">Languages Loaded:</span> {i18n.languages?.join(', ')}
          </div>
          <div>
            <span className="font-medium">i18n Initialized:</span> {i18n.isInitialized ? 'Yes' : 'No'}
          </div>
          <div>
            <span className="font-medium">Translation Test:</span>
          </div>
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Key</th>
                <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">Translated Value</th>
              </tr>
            </thead>
            <tbody>
              {[
                'Ministry of Development of North Eastern Region',
                'AI-Powered DPR Risk Assessment',
                'Multi-lingual Support',
                'Key Features',
                'Login'
              ].map((key) => (
                <tr key={key}>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{key}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-2">{t(key)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-4">
            <button 
              onClick={() => i18n.changeLanguage('en')}
              className="px-3 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
            >
              Switch to English
            </button>
            <button 
              onClick={() => i18n.changeLanguage('hi')}
              className="px-3 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
            >
              Switch to Hindi
            </button>
            <button 
              onClick={() => i18n.changeLanguage('as')}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Switch to Assamese
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}