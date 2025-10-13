'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

const languages = [
  { label: 'English', value: 'en' },
  { label: 'हिन्दी', value: 'hi' },
  { label: 'অসমীয়া', value: 'as' }
]

export function LanguageSelector() {
  const { i18n, t } = useTranslation()
  const router = useRouter()
  const [currentLang, setCurrentLang] = useState('en')
  const [isChanging, setIsChanging] = useState(false)
  
  useEffect(() => {
    // Initialize language from localStorage first, then from i18n
    const storedLang = localStorage.getItem('dprAiLanguage')
    if (storedLang && languages.some(lang => lang.value === storedLang)) {
      setCurrentLang(storedLang)
      // Ensure i18n language matches stored language
      if (i18n.language !== storedLang) {
        i18n.changeLanguage(storedLang)
      }
    } else {
      setCurrentLang(i18n.language || 'en')
    }
  }, [i18n])
  
  const changeLang = async (lang: string) => {
    try {
      if (isChanging || lang === currentLang) return
      
      setIsChanging(true)
      
      // Store in localStorage with multiple keys to ensure compatibility
      localStorage.setItem('dprAiLanguage', lang)
      localStorage.setItem('i18nextLng', lang)
      document.cookie = `i18next=${lang}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year
      
      // Update i18n language
      await i18n.changeLanguage(lang)
      
      // Update state for UI feedback
      setCurrentLang(lang)
      
      // Force reload the page - this is the simplest and most reliable approach
      if (typeof window !== 'undefined') {
        // Show a success message
        toast({
          title: t('common.languageChanged'),
          description: t('common.languageChangedMessage'),
          duration: 1000, // shorter duration before reload
        })
        
        // Hard reload the page after a short delay
        setTimeout(() => {
          console.log('Reloading page to apply language change to:', lang)
          window.location.href = window.location.pathname + '?lang=' + lang // Add lang param for extra reliability
        }, 800) // shorter delay to make the language change feel more responsive
      }
      
      setIsChanging(false)
    } catch (error) {
      console.error('Failed to change language:', error)
      setIsChanging(false)
      setCurrentLang(i18n.language || 'en') // Revert to current language on error
      
      // Show error toast
      toast({
        title: t('common.error'),
        description: t('common.languageChangeError'),
        variant: 'destructive',
        duration: 3000,
      })
    }
  }
  
  // Determine language name based on current language
  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.value === currentLang)
    return lang ? lang.label : 'English'
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative" 
          title={t('common.changeLanguage')}
          disabled={isChanging}
        >
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="absolute -top-1 -right-1 text-xs font-bold rounded-full bg-accent text-accent-foreground w-5 h-5 flex items-center justify-center">
            {currentLang.toUpperCase()}
          </span>
          <span className="sr-only">{t('common.changeLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => changeLang(lang.value)}
            className={`flex items-center gap-2 ${currentLang === lang.value ? 'bg-accent text-accent-foreground font-bold' : ''}`}
            disabled={isChanging}
          >
            <span className="w-5 h-5 flex items-center justify-center bg-accent/10 rounded-full text-xs">
              {lang.value.toUpperCase()}
            </span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
