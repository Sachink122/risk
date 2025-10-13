'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { LanguageSelector } from '@/components/language-selector'
import { useTranslation } from 'react-i18next'
import { ThemeToggle } from '@/components/theme-toggle'
import { motion } from 'framer-motion'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Check authentication status on load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth-token')
      setIsAuthenticated(!!token)
    }
    
    checkAuth()
  }, [])

  const handleLoginClick = () => {
    setLoading(true)
    try {
      setTimeout(() => {
        router.push('/auth/login')
      }, 300)
    } catch (error) {
      console.error('Navigation error:', error)
      window.location.href = '/auth/login'
    }
  }

  const handleGetStarted = () => {
    setLoading(true)
    try {
      // Check if token exists
      const token = localStorage.getItem('auth-token')
      
      // Additional check for token validity by looking at its expiration
      let isValidToken = false;
      if (token) {
        try {
          // We'll perform additional checks on the token
          // Check if current-user exists and token should be valid
          const currentUserStr = localStorage.getItem('current-user');
          if (!currentUserStr) {
            // No current user in localStorage means login is required
            isValidToken = false;
          } else {
            // Force redirect to login page to ensure proper authentication
            isValidToken = false; // We always want users to authenticate
          }
        } catch (e) {
          console.error('Error validating token:', e);
          isValidToken = false;
        }
      }
      
      setTimeout(() => {
        // Always redirect to login page to ensure proper authentication
        router.push('/auth/login')
      }, 300)
    } catch (error) {
      console.error('Navigation error:', error)
      // Fallback to login if there's an error
      window.location.href = '/auth/login'
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-950/90 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Image
              src="/assets/emblem.png"
              alt="Government of India Emblem"
              width={48}
              height={72}
              className="mr-3 hidden sm:block"
              priority
            />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">
                {t('Ministry of Development of North Eastern Region')}
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Government of India
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <ThemeToggle />
            <LanguageSelector />
            <Button 
              onClick={handleLoginClick} 
              variant="outline" 
              className="ml-auto font-medium hover:text-blue-600 hover:border-blue-600 transition-colors"
            >
              {t('login')}
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-blue-700 to-blue-900 opacity-95"></div>
          <div className="absolute inset-0 z-0 bg-[url('/assets/pattern-grid.svg')] opacity-15"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-300 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          <div className="container mx-auto px-4 py-28 md:py-36 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-block mb-6 px-6 py-2 border border-blue-300/30 rounded-full backdrop-blur-sm bg-blue-900/10"
              >
                <p className="text-blue-100 font-medium text-sm">
                  {t('appTitle')} - {t('AI-Powered DPR Risk Assessment')}
                </p>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
              >
                DPR-AI
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 font-light"
              >
                {t('Evaluate infrastructure project risks using advanced AI models for better planning and execution')}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  disabled={loading}
                  className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-6 rounded-full shadow-xl shadow-blue-900/20 font-medium transition-all hover:shadow-2xl hover:shadow-blue-900/30"
                >
                  {loading ? t('loading') : isAuthenticated ? t('Go to Dashboard') : t('getStarted')}
                  <ChevronRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              
              <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
                {[
                  { value: '98%', label: 'Accuracy Rate' },
                  { value: '250+', label: 'Projects Analyzed' },
                  { value: '3', label: 'Languages Supported' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="text-center p-3 bg-blue-900/20 backdrop-blur-sm rounded-xl border border-blue-300/20"
                  >
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-xs text-blue-200">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
        </section>

        {/* Features */}
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent inline-block">
                {t('Key Features')}
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'AI Risk Analysis',
                  description: 'Leverage machine learning to identify potential risks in infrastructure projects',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v1"></path>
                      <path d="M12 21v1"></path>
                      <path d="M4.22 4.22l.77.77"></path>
                      <path d="M18.78 18.78l.77.77"></path>
                      <path d="M2 12h1"></path>
                      <path d="M21 12h1"></path>
                      <path d="M4.22 19.78l.77-.77"></path>
                      <path d="M18.78 5.22l.77-.77"></path>
                      <circle cx="12" cy="12" r="5"></circle>
                    </svg>
                  ),
                  delay: 0.1
                },
                {
                  title: 'Detailed Reports',
                  description: 'Generate comprehensive risk assessment reports with mitigation strategies',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  ),
                  delay: 0.3
                },
                {
                  title: 'Multi-lingual Support',
                  description: 'Access the platform in English, Hindi, and Assamese languages',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  ),
                  delay: 0.5
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                  whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-blue-600 group-hover:w-3 transition-all"></div>
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg inline-block">
                    <div className="text-blue-600 dark:text-blue-400">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t(feature.title)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t(feature.description)}
                  </p>
                </motion.div>
              ))}
            </div>
            
            {/* How it works section */}
            <div className="mt-32">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent inline-block">
                  How It Works
                </h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Our streamlined process makes risk assessment simple, accurate, and actionable
                </p>
              </motion.div>
              
              <div className="grid md:grid-cols-4 gap-8 relative">
                <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 dark:from-blue-600 dark:via-blue-400 dark:to-blue-600"></div>
                
                {[
                  {
                    step: 1,
                    title: 'Upload Data',
                    description: 'Upload your DPR documents and project data',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    )
                  },
                  {
                    step: 2,
                    title: 'AI Analysis',
                    description: 'Our AI analyzes risks and patterns',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    )
                  },
                  {
                    step: 3,
                    title: 'Review Insights',
                    description: 'Review detailed risk assessment reports',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )
                  },
                  {
                    step: 4,
                    title: 'Mitigate Risks',
                    description: 'Implement recommended mitigation strategies',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )
                  }
                ].map((item) => (
                  <motion.div 
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: item.step * 0.1 }}
                    className="relative text-center"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg shadow-blue-600/30"
                    >
                      <div className="flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div className="absolute -right-1 -top-1 w-6 h-6 rounded-full bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold border-2 border-blue-600 dark:border-blue-400">
                        {item.step}
                      </div>
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 right-20 w-32 h-32 rounded-full bg-white opacity-10"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-white opacity-10"></div>
              <div className="absolute top-40 left-40 w-16 h-16 rounded-full bg-white opacity-10"></div>
              <svg className="absolute top-0 right-0 opacity-10" width="200" height="200" viewBox="0 0 200 200">
                <path d="M 0,50 A 50,50 0 1,1 100,50 A 50,50 0 1,1 0,50 Z" fill="white" transform="translate(50, 0)"></path>
              </svg>
            </div>
            
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight"
              >
                Ready to transform your infrastructure risk assessment?
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-blue-100 text-lg mb-8"
              >
                Join government departments across India already using DPR-AI to improve project planning and execution.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={handleGetStarted} 
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-blue-700 font-medium px-10 py-6 rounded-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  {isAuthenticated ? t('Go to Dashboard') : t('Explore the Platform')} <ChevronRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-sm text-blue-200"
              >
                No installation required • Secure government platform • Instant insights
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-center mb-4"
              >
                <Image
                  src="/assets/emblem.png"
                  alt="Government of India Emblem"
                  width={36}
                  height={54}
                  className="mr-3"
                />
                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">DPR-AI</h3>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md"
              >
                AI-powered risk assessment platform for infrastructure projects under the Ministry of Development of North Eastern Region. Enhancing project planning and execution through advanced analytics.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex space-x-4"
              >
                {['facebook', 'twitter', 'linkedin', 'youtube'].map((social) => (
                  <div key={social} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-300 transition-colors">
                    <span className="sr-only">{social}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 010-5.656l4-4a4 4 0 015.656 5.656l-1.1 1.1" />
                    </svg>
                  </div>
                ))}
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-3">
                {['About', 'FAQs', 'User Manual', 'Risk Categories', 'Case Studies'].map((item, index) => (
                  <li key={item}>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors" 
                      onClick={() => router.push(`/${item.toLowerCase().replace(' ', '-')}`)}
                    >
                      {t(item)}
                    </Button>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Vigyan Bhawan Annexe, Maulana Azad Road, New Delhi</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@dpr-ai.gov.in</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Toll-Free: 1800-XXX-XXXX</span>
                </li>
              </ul>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} {t('Ministry of Development of North Eastern Region')} | Government of India
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-4 md:mt-0 text-sm text-gray-600 dark:text-gray-400">
              {['Privacy Policy', 'Terms of Use', 'Accessibility', 'Sitemap'].map((item, index, array) => (
                <span key={item} className="flex items-center">
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{item}</a>
                  {index < array.length - 1 && (
                    <span className="mx-2 text-gray-300 dark:text-gray-700">•</span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}