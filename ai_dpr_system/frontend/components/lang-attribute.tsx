'use client'

import { useLangAttribute } from '@/lib/hooks/use-lang-attribute'

export default function LangAttribute({
  children
}: {
  children: React.ReactNode
}) {
  // Use the custom hook for language attribute management
  const lang = useLangAttribute()

  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      {children}
    </html>
  )
}