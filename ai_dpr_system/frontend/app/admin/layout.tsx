'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/auth-provider'
import { useRouter, usePathname } from 'next/navigation'
import { UserProfile } from '@/components/user-profile'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSelector } from '@/components/language-selector'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { AdminIcons } from '@/components/admin-icons'
import { Search, Bell, Menu, X, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { markAllNotificationsAsRead } from '@/lib/admin/notifications'
// Local notification type used in this layout
type NotificationItem = { id: number; text: string; time: string; read: boolean }

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [status, setStatus] = useState({
    isChecking: true,
    isAuthorized: false,
    userAvatar: undefined as string | undefined
  })

  // Load notifications from localStorage and handle clicks outside the dropdown
  useEffect(() => {
    // Load real notifications from localStorage
    const loadNotifications = () => {
      try {
        if (typeof window !== 'undefined') {
          const savedNotifications = localStorage.getItem('admin-notifications')
          if (savedNotifications) {
            const parsedNotifications: NotificationItem[] = JSON.parse(savedNotifications)
            setNotifications(parsedNotifications)
          }
        }
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }

    loadNotifications()

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Check if the click is outside the notifications dropdown
      if (notificationsOpen && !target.closest('[data-notifications-container]')) {
        setNotificationsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationsOpen])

  // Consolidate all side effects into a single useEffect to ensure consistent execution
  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      try {
        // If user is undefined, we're still loading
        if (user === undefined) {
          return; // Wait for user to load
        }
        
        // Get admin status from localStorage directly for consistency
        let isAdmin = false;
        let avatarUrl: string | undefined = undefined;
        
        // Only access localStorage in the browser environment
        if (typeof window !== 'undefined') {
          try {
            // Check admin status
            const currentUserStr = localStorage.getItem('current-user')
            if (currentUserStr) {
              const userData = JSON.parse(currentUserStr)
              isAdmin = userData && userData.is_admin === true
            }
            
            // Check for profile image if authorized
            if (isAdmin) {
              // Get the admin-specific avatar
              const adminAvatar = localStorage.getItem('adminAvatar');
              if (adminAvatar) {
                avatarUrl = adminAvatar;
              }
              
              // Fallback to adminSettings if adminAvatar doesn't exist
              if (!avatarUrl) {
                const adminSettings = localStorage.getItem('adminSettings');
                if (adminSettings) {
                  const parsedSettings = JSON.parse(adminSettings);
                  if (parsedSettings.profileImage) {
                    avatarUrl = parsedSettings.profileImage;
                  }
                }
              }
            }
          } catch (e) {
            console.error('Error checking user data:', e)
          }
        }
        
        setStatus({
          isChecking: false,
          isAuthorized: isAdmin,
          userAvatar: avatarUrl
        })
        
        // Redirect non-admins to login page instead of dashboard
        if (!isAdmin && user !== undefined) {
          // Clear any tokens to ensure proper re-authentication
          localStorage.removeItem('auth-token');
          localStorage.removeItem('refresh-token');
          router.replace('/auth/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setStatus(prev => ({ ...prev, isChecking: false }))
      }
    }
    
    checkAuthAndLoadProfile()
  }, [user, router])

  // Show loading state while checking
  if (status.isChecking) {
    return <div className="flex items-center justify-center h-screen">Checking permissions...</div>
  }
  
  // If not authorized and checked, show access denied (will redirect anyway)
  if (!status.isAuthorized && !status.isChecking) {
    return <div className="flex items-center justify-center h-screen">Access Denied. Redirecting...</div>
  }
  
  // Define navigation items with icons
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: AdminIcons.Dashboard },
    { name: 'Users', href: '/admin/users', icon: AdminIcons.Users },
    { name: 'User Monitoring', href: '/admin/user-monitoring', icon: AdminIcons.Monitoring },
    { name: 'Reports', href: '/admin/reports', icon: AdminIcons.Reports },
    { name: 'Risk Analysis', href: '/admin/risk-analysis', icon: AdminIcons.RiskAlerts },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Settings', href: '/admin/settings', icon: AdminIcons.Settings },
  ]
  
  // Admin user - render the children with admin header
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">DPR-AI Admin</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-4 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md",
                  isActive 
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground" 
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-gray-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 md:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="hidden md:flex items-center gap-3">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  DPR-AI
                </span>
                <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                  Admin Panel
                </span>
              </div>
            </div>
            
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  if (searchQuery.trim()) {
                    router.push(`/admin/dashboard?search=${encodeURIComponent(searchQuery.trim())}`)
                  }
                }}
                className="relative flex items-center w-full"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input 
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-12 rounded-full border-gray-300 dark:border-gray-600"
                />
                <Button 
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-full"
                  disabled={!searchQuery.trim()}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </form>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="relative" data-notifications-container>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="rounded-full relative"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-white dark:border-gray-800"></span>
                    )}
                  </Button>
                  
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700" data-notifications-container>
                      <div className="px-4 py-2 border-b dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold">Notifications</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-primary"
                            onClick={() => {
                              markAllNotificationsAsRead()
                              setNotifications(notifications.map(n => ({ ...n, read: true })))
                            }}
                          >
                            Mark all as read
                          </Button>
                        </div>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.map((notification: NotificationItem) => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-0 ${notification.read ? 'opacity-70' : ''}`}
                          >
                            <div className="flex justify-between">
                              <p className="text-sm">{notification.text}</p>
                              {!notification.read && (
                                <span className="h-2 w-2 rounded-full bg-primary"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t dark:border-gray-700">
                        <Link 
                          href="/admin/notifications"
                          className="text-xs text-center w-full block text-primary"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                
                <ThemeToggle />
                <LanguageSelector />
              </div>
              
              <div className="border-l h-6 mx-2 border-gray-200 dark:border-gray-700" />
              
              {user && (
                <UserProfile 
                  userName={user.full_name || 'Admin User'} 
                  userEmail={user.email} 
                  userRole="Administrator"
                  userAvatar={status.userAvatar} 
                />
              )}
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-sm overflow-y-auto">
          <div className="py-6 px-3">
            <div className="space-y-6">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md",
                        isActive 
                          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground" 
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-gray-400")} />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
              
              <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  System
                </h3>
                <div className="mt-2 space-y-1">
                  <Link 
                    href="/admin/system-logs"
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <AdminIcons.Database className="h-5 w-5 text-gray-400" />
                    System Logs
                  </Link>
                  <Link 
                    href="/admin/monitoring"
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <AdminIcons.Monitoring className="h-5 w-5 text-gray-400" />
                    Monitoring
                  </Link>
                  <Link 
                    href="/admin/help"
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <AdminIcons.Help className="h-5 w-5 text-gray-400" />
                    Help & Support
                  </Link>
                </div>
              </div>
            </div>
            
            {/* System Status Indicator */}
            <div className="mt-6 px-3">
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Online
                </Badge>
                <span className="text-xs text-green-800 dark:text-green-300">System Operational</span>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}