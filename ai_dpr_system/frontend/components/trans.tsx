'use client'

import { useTranslation } from 'react-i18next'

interface TransProps {
  i18nKey: string
  values?: Record<string, string>
  children?: React.ReactNode
}

export function Trans({ i18nKey, values, children }: TransProps) {
  const { t } = useTranslation()
  
  return (
    <>
      {t(i18nKey, values)}
      {children}
    </>
  )
}