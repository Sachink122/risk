'use client'

import { useEffect } from 'react'
import { useLangAttribute } from '@/lib/hooks/use-lang-attribute'

export default function LangAttribute({
  children
}: {
  children: React.ReactNode
}) {
  const lang = useLangAttribute()

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement
      html.setAttribute('lang', lang)
      html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    }
  }, [lang])

  return children as React.ReactElement
}