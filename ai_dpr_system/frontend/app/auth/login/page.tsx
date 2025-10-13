'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth/auth-provider'
import Image from 'next/image'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { ThemeToggle } from '@/components/theme-toggle'

const loginSchema = z.object({
  email: z.string().min(3, { message: 'Please enter a valid user ID or email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@example.gov.in',
      password: 'password123',
    },
  })
  
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      console.log('Attempting login with:', data.email)
      await login(data.email, data.password)
      toast({
        title: 'Login successful',
        description: 'Welcome back to DPR-AI system',
      })
      // The redirection will be handled by the auth provider based on user role
    } catch (error: any) {
      console.error('Login error details:', error)
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.response?.data?.detail || 'Invalid email or password. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50 dark:bg-slate-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex items-center mb-8">
        <Image
          src="/assets/emblem.png"
          alt="Government of India"
          width={60}
          height={80}
          className="h-16 w-auto mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold text-gov-navy dark:text-white">
            DPR-AI System
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Ministry of Development of North Eastern Region
          </p>
        </div>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the DPR-AI system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-3 mb-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Test Credentials</strong><br/>
                User ID: admin@example.gov.in<br/>
                Password: password123
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 bg-blue-100 dark:bg-blue-800 border-blue-300 dark:border-blue-600 hover:bg-blue-200 dark:hover:bg-blue-700"
                onClick={() => {
                  // Directly submit the form with test credentials
                  onSubmit({
                    email: 'admin@example.gov.in',
                    password: 'password123',
                  });
                }}
              >
                Quick Login with Test Credentials
              </Button>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">User ID / Email</Label>
              <Input
                id="email"
                placeholder="your.email@example.gov.in"
                {...register('email')}
                className="border-2"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="border-2"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 w-full">
          <div className="flex justify-between w-full">
            <Button variant="ghost" onClick={() => router.push('/auth/forgot-password')}>
              Forgot password?
            </Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </div>
          <div className="flex justify-center items-center w-full border-t pt-4">
            <p className="text-sm text-gray-500 mr-2">Don't have an account?</p>
            <Button variant="link" onClick={() => router.push('/auth/register')} className="p-0">
              Register now
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}