'use client'

import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/lib/auth/auth-provider'
import { useState } from 'react'
import { I18nProvider } from '@/lib/i18n/i18n-provider'
import { LanguageChangeHandler } from '@/components/language-change-handler'

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a client with custom settings
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* Add the language change handler to ensure consistent language experience */}
            {typeof window !== 'undefined' && <LanguageChangeHandler />}
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </I18nProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}