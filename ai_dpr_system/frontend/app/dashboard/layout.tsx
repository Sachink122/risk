'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth/auth-provider'
import { LanguageSelector } from '@/components/language-selector'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserProfile } from '@/components/user-profile'
import {
  FileText,
  LayoutDashboard,
  Upload,
  BarChart,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t } = useTranslation()
  const { user, logout, setUser } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined)
  
  // Effect to keep sidebar visible on desktop
  useEffect(() => {
    // Function to handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 768) { // 768px is standard md: breakpoint
        setSidebarOpen(true);
      }
    };
    
    // Set initial state based on screen size
    if (typeof window !== 'undefined') {
      handleResize();
      
      // Add resize listener
      window.addEventListener('resize', handleResize);
      
      // Cleanup
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Effect to load user avatar from local storage
  useEffect(() => {
    try {
      // Get current user ID
      const currentUserStr = localStorage.getItem('current-user');
      const userData = currentUserStr ? JSON.parse(currentUserStr) : null;
      const userId = userData?.id || 'default';
      
      // For regular dashboard, use user-specific avatar
      const userSettings = localStorage.getItem('userSettings');
      if (userSettings) {
        const parsedSettings = JSON.parse(userSettings);
        
        // First try to get user-specific image
        if (parsedSettings.userProfileImages && parsedSettings.userProfileImages[userId]) {
          setUserAvatar(parsedSettings.userProfileImages[userId]);
        } 
        // Fallback to legacy profileImage field
        else if (parsedSettings.profileImage) {
          setUserAvatar(parsedSettings.profileImage);
        }
      }
    } catch (e) {
      console.error('Error getting profile image from localStorage:', e);
    }
  }, []);

  // Listen for changes to localStorage to update user profile in real time
  useEffect(() => {
    // Function to refresh user data from localStorage
    const refreshUserData = () => {
      try {
        const currentUserStr = localStorage.getItem('current-user')
        if (currentUserStr && setUser) {
          const userData = JSON.parse(currentUserStr)
          if (userData && userData.email) {
            // Ensure is_admin is properly set
            setUser({
              id: userData.id || '1',
              email: userData.email,
              full_name: userData.full_name || 'User',
              department: userData.department || 'Department',
              is_admin: userData.is_admin === true,
              is_reviewer: userData.is_reviewer === true
            })
          }
        }

        // Also refresh avatar - for regular dashboard, use user-specific avatar
        try {
          // Get current user ID
          const currentUserStr = localStorage.getItem('current-user');
          const userData = currentUserStr ? JSON.parse(currentUserStr) : null;
          const userId = userData?.id || 'default';
          
          const userSettings = localStorage.getItem('userSettings');
          if (userSettings) {
            const parsedSettings = JSON.parse(userSettings);
            
            // First try to get user-specific image
            if (parsedSettings.userProfileImages && parsedSettings.userProfileImages[userId]) {
              setUserAvatar(parsedSettings.userProfileImages[userId]);
            } 
            // Fallback to legacy profileImage field
            else if (parsedSettings.profileImage) {
              setUserAvatar(parsedSettings.profileImage);
            }
          }
        } catch (e) {
          console.error('Error refreshing avatar:', e);
        }
      } catch (e) {
        console.error('Error refreshing user data:', e)
      }
    }
    
    // Listen for storage events (when another tab updates localStorage)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'current-user' || event.key === 'userSettings') {
        refreshUserData()
      }
    }
    
    // Add event listener for cross-tab updates
    window.addEventListener('storage', handleStorageChange)
    
    // Also run once on mount to ensure we have the latest data
    refreshUserData()
    
    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [setUser])
  
  // Determine admin status from localStorage as well
  const isAdmin = (() => {
    if (typeof window !== 'undefined') {
      try {
        const currentUserStr = localStorage.getItem('current-user')
        if (currentUserStr) {
          const storedUser = JSON.parse(currentUserStr)
          return storedUser && storedUser.is_admin === true
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e)
      }
    }
    return false
  })()

  // Check if user is admin and redirect to admin dashboard
  useEffect(() => {
    // Only execute in browser environment
    if (typeof window === 'undefined') return;
    
    // Always redirect admin users to admin dashboard
    if (isAdmin) {
      // If we're in the user dashboard and the user is an admin, redirect to admin dashboard
      if (pathname === '/dashboard') {
        // Use a small delay to ensure all state is properly updated
        setTimeout(() => {
          window.location.href = '/admin/dashboard'
        }, 100)
      }
    }
  }, [pathname, isAdmin])
  
  // Define the navigation item type
  type NavItem = {
    name: string;
    href: string;
    icon: any;
    isGovt?: boolean;
  };

  const navigation: NavItem[] = [
    { name: t('Dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('Dprs'), href: '/dprs', icon: FileText },
    { name: t('Upload'), href: '/dprs/upload', icon: Upload },
    { name: t('Reports'), href: '/reports', icon: BarChart },
    { name: 'GOI Risk', href: '/dashboard/risk-prediction', icon: BarChart, isGovt: true },
    { name: t('Settings'), href: '/settings', icon: Settings },
  ]
  
  // Add admin dashboard link for admins
  if (user?.is_admin) {
    navigation.push({ name: t('Admin Panel'), href: '/admin/dashboard', icon: Users })
  }
  
  const handleLogout = async () => {
    await logout()
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 transition-transform duration-300 ease-in-out shadow-lg ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:w-64 md:min-h-screen border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="flex h-20 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <div className="bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-sm">
              <Image
                src="/assets/emblem.png"
                alt="Government of India"
                width={40}
                height={60}
                className="h-10 w-auto"
              />
            </div>
            <div className="ml-3">
              <span className="font-semibold text-lg text-indigo-700 dark:text-white">
                DPR System
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400">Risk Assessment Portal</div>
            </div>
          </div>
          <button
            className="md:hidden rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 transition-all"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-6 space-y-2 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            
            // Function to handle link click
            const handleLinkClick = () => {
              // Only close sidebar on mobile
              if (window.innerWidth < 768) {
                setSidebarOpen(false);
              }
            };
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={`group flex items-center px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  item.isGovt 
                    ? 'bg-white text-gray-800 border border-gray-200 relative overflow-hidden shadow-sm'
                    : isActive
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 shadow-sm'
                      : 'text-gray-700 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-700/50 hover:shadow-sm'
                }`}
              >
                {item.isGovt && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
                )}
                <div className={`flex items-center justify-center mr-3 ${
                  item.isGovt 
                    ? 'rounded-full p-1.5'
                    : isActive ? 'bg-indigo-200 dark:bg-indigo-800 rounded-full p-1.5' : 'rounded-full p-1.5'
                }`}>
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      item.isGovt 
                        ? 'text-gray-800'
                        : isActive ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <span className={isActive ? 'font-semibold' : ''}>
                  {item.name}
                </span>
                {isActive && !item.isGovt && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
                )}
                {item.isGovt && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="h-3.5 w-3.5 bg-contain bg-center bg-no-repeat"
                         style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg')" }}>
                    </div>
                  </div>
                )}
              </Link>
            )
          })}
          
          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              className="w-full group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-white dark:text-red-400 dark:hover:bg-gray-700/50 transition-all duration-200 hover:shadow-sm"
              onClick={(e) => {
                handleLogout();
                // Don't close sidebar on desktop
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
            >
              <div className="flex items-center justify-center mr-3 rounded-full p-1.5">
                <LogOut className="h-5 w-5 flex-shrink-0 text-red-500 dark:text-red-400" aria-hidden="true" />
              </div>
              <span>{t('Logout')}</span>
            </button>
          </div>
        </nav>
      </div>
      
      <div className="flex flex-1 flex-col">
        {/* Top header */}
        <div className="border-b dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex h-20 items-center justify-between px-6">
            {/* Mobile menu button */}
            <div className="flex items-center space-x-4">
              <button
                className="md:hidden rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 transition-all"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open sidebar</span>
              </button>
              
              {user && (
                <UserProfile 
                  userName={user?.full_name || 'User'} 
                  userEmail={user?.email} 
                  userRole={user?.is_admin ? 'Administrator' : user?.is_reviewer ? 'Reviewer' : 'User'}
                  userAvatar={userAvatar}
                />
              )}
            </div>
            
            <div className="flex items-center space-x-3 md:space-x-5 ml-auto">
              <div className="hidden md:block px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-gray-700 text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                DPR Risk Assessment System
              </div>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  )
}