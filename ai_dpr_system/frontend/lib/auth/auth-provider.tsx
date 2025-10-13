'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import authService from '../api/auth-service'

interface User {
  id: string
  email: string
  full_name: string
  department: string
  is_admin: boolean
  is_reviewer: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  error: string | null
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  // Check if the user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a token
        const token = localStorage.getItem('auth-token')
        if (!token) {
          setIsLoading(false)
          return
        }

        // If we have a current user in localStorage, use that data
        const currentUserFromStorage = localStorage.getItem('current-user')
        if (currentUserFromStorage) {
          try {
            const userData = JSON.parse(currentUserFromStorage)
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
              setIsLoading(false)
              return
            }
          } catch (e) {
            console.error('Error parsing current user from localStorage:', e)
          }
        }

        // Fetch current user data
        const response = await authService.getCurrentUser()
        setUser(response.data)
        setError(null)
      } catch (err) {
        console.error('Authentication error:', err)
        // Clear any invalid tokens
        localStorage.removeItem('auth-token')
        localStorage.removeItem('refresh-token')
        setError('Session expired. Please login again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])
  
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.login(email, password)
      console.log('Login response in auth provider:', response)
      
      // Check if user data exists in the response
      if (response.user) {
        setUser(response.user)
        
        // Check if the user is an admin and redirect accordingly
        if (response.user.is_admin) {
          router.push('/admin/dashboard')
        } else {
          router.push('/dashboard')
        }
      } else {
        // Handle case where user data isn't included in the token response
        // We can make an extra call to get user info or decode from token
        try {
          const userResponse = await authService.getCurrentUser()
          setUser(userResponse.data)
          
          // Check if the user is an admin and redirect accordingly
          if (userResponse.data.is_admin) {
            router.push('/admin/dashboard')
          } else {
            router.push('/dashboard')
          }
        } catch (userErr) {
          console.error('Failed to fetch user data after login:', userErr)
          // Default redirect if we can't determine user role
          router.push('/dashboard')
        }
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }
  
  const logout = () => {
    setIsLoading(true)
    
    try {
      authService.logout()
      setUser(null)
      router.push('/auth/login')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        error,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}