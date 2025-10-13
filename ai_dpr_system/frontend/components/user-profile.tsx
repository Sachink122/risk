'use client'

import React from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-provider'
import Link from 'next/link'

interface UserProfileProps {
  userName: string
  userEmail?: string
  userAvatar?: string
  userRole?: string
}

export function UserProfile({ 
  userName, 
  userEmail, 
  userAvatar, 
  userRole 
}: UserProfileProps) {
  const router = useRouter()
  const { logout } = useAuth()
  
  // Get initials from name
  const initials = userName
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase() || 'U'
  
  const handleLogout = async () => {
    await logout()
    // Clear any tokens to ensure proper re-authentication
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      // Use direct navigation to ensure a full page reload
      window.location.href = '/auth/login';
    } else {
      router.push('/auth/login')
    }
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <Avatar className="h-9 w-9 cursor-pointer border-2 border-indigo-200 dark:border-indigo-700 shadow-sm">
            {userAvatar ? (
              <AvatarImage src={userAvatar} alt={userName} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="hidden md:inline-block font-medium text-sm text-gray-800 dark:text-gray-200">{userName}</span>
            {userRole && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 font-medium">
                {userRole}
              </span>
            )}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2 shadow-lg border border-gray-200 dark:border-gray-700">
        <DropdownMenuLabel className="text-indigo-600 dark:text-indigo-400 font-medium">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-3 bg-gray-50 dark:bg-gray-800/70 rounded-md my-1">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{userName}</p>
          {userEmail && <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">{userEmail}</p>}
          {userRole && (
            <div className="mt-2 flex items-center">
              <div className="h-2 w-2 rounded-full bg-indigo-500 dark:bg-indigo-400 mr-2"></div>
              <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">{userRole}</p>
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        {userRole === 'Administrator' ? (
          <Link href="/admin/settings">
            <DropdownMenuItem className="cursor-pointer rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 focus:bg-indigo-50 dark:focus:bg-indigo-900/30 my-1">
              <div className="bg-indigo-100 dark:bg-indigo-800/50 p-1.5 rounded-full mr-3">
                <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span>Admin Settings</span>
            </DropdownMenuItem>
          </Link>
        ) : (
          <Link href="/settings">
            <DropdownMenuItem className="cursor-pointer rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 focus:bg-indigo-50 dark:focus:bg-indigo-900/30 my-1">
              <div className="bg-indigo-100 dark:bg-indigo-800/50 p-1.5 rounded-full mr-3">
                <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuItem className="cursor-pointer rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20 mt-1" onClick={handleLogout}>
          <div className="bg-red-100 dark:bg-red-800/30 p-1.5 rounded-full mr-3">
            <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <span className="text-red-600 dark:text-red-400">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}