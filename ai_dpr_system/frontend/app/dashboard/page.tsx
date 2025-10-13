'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-provider'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart4,
  FileText,
  FileCheck,
  AlertTriangle,
  Upload,
  Clipboard,
  TrendingUp,
  Hourglass,
  PieChart,
  Shield,
  BadgeCheck,
  FileX,
  Activity,
  Clock,
  Eye,
  Calendar,
  Building,
  CheckCircle as CircleCheck,
  BarChart2,
  Settings,
  Tag,
  HelpCircle,
  BookOpen
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalDprs: 0,
    evaluatedDprs: 0,
    pendingDprs: 0,
    highRiskDprs: 0,
    progressPercentage: 0
  })
  const [recentDprs, setRecentDprs] = useState<any[]>([])
  const [riskDistribution, setRiskDistribution] = useState({
    high: 0,
    medium: 0,
    low: 0
  })
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
    
    // Fetch dashboard stats and DPRs
    if (isAuthenticated) {
      // Fetch stored DPRs from localStorage
      const storedDprs = JSON.parse(localStorage.getItem('uploaded-dprs') || '[]');
      
      // Calculate statistics
      const totalDprs = storedDprs.length;
      const evaluatedDprs = storedDprs.filter((dpr: any) => dpr.status === 'Evaluated').length;
      const pendingDprs = storedDprs.filter((dpr: any) => dpr.status === 'Pending').length;
      const highRiskDprs = storedDprs.filter((dpr: any) => dpr.riskLevel === 'High').length;
      
      // Risk distribution
      const mediumRiskDprs = storedDprs.filter((dpr: any) => dpr.riskLevel === 'Medium').length;
      const lowRiskDprs = storedDprs.filter((dpr: any) => dpr.riskLevel === 'Low').length;
      
      // Set dashboard statistics
        setStats({
          totalDprs,
          evaluatedDprs,
          pendingDprs,
          highRiskDprs,
          progressPercentage: totalDprs > 0 ? Math.round((evaluatedDprs / totalDprs) * 100) : 0
        });
        
        // Get recent DPRs (up to 5)
        const recent = [...storedDprs].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()).slice(0, 5);
        setRecentDprs(recent);
        
        setRiskDistribution({
          high: highRiskDprs,
          medium: mediumRiskDprs,
          low: lowRiskDprs
        });
    }
  }, [isAuthenticated, isLoading, router])
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-b-transparent border-l-transparent border-r-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Only dashboard content, no duplicate profile section */}

      {/* Main content */}
      <div className="flex-1 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-950 p-6">
        <div className="container mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome, {user?.full_name?.split(' ')[0] || 'User'}!</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Here's your DPR monitoring dashboard. {stats.pendingDprs > 0 ? `You have ${stats.pendingDprs} pending DPR${stats.pendingDprs > 1 ? 's' : ''} awaiting evaluation.` : 'All your DPRs have been evaluated.'}
                </p>
              </div>
              <div className="hidden md:block">
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700 px-3 py-1 text-xs">
                  <Clock className="w-3 h-3 mr-1 inline" /> Last Updated: {new Date().toLocaleString()}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Total DPRs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">{stats.totalDprs}</div>
                  <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-full shadow-inner">
                    <FileText className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  {stats.totalDprs === 0 ? 'No DPRs uploaded yet' : `${stats.progressPercentage}% evaluated`}
                </p>
                {stats.totalDprs > 0 && 
                  <div className="mt-3">
                    <Progress 
                      value={stats.progressPercentage} 
                      className="h-2 rounded-full bg-indigo-100 dark:bg-indigo-950 [&>div]:bg-indigo-500 [&>div]:dark:bg-indigo-400" 
                    />
                  </div>
                }
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 dark:border-green-900/40 rounded-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                  <BadgeCheck className="h-4 w-4 mr-2" />
                  Evaluated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">{stats.evaluatedDprs}</div>
                  <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full shadow-inner">
                    <FileCheck className="h-6 w-6 text-green-500 dark:text-green-400" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  {stats.totalDprs > 0 
                    ? <span className="flex items-center">
                        <BadgeCheck className="h-4 w-4 mr-1 text-green-500" />
                        {`${stats.evaluatedDprs} of ${stats.totalDprs} DPRs processed`}
                      </span> 
                    : 'No DPRs evaluated yet'
                  }
                </p>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100 dark:border-amber-900/40 rounded-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center">
                  <Hourglass className="h-4 w-4 mr-2" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">{stats.pendingDprs}</div>
                  <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded-full shadow-inner">
                    <Clock className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  {stats.pendingDprs > 0 
                    ? <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-amber-500" />
                        {`${stats.pendingDprs} DPR${stats.pendingDprs > 1 ? 's' : ''} awaiting review`}
                      </span>
                    : 'No pending DPRs'
                  }
                </p>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100 dark:border-red-900/40 rounded-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  High Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">{stats.highRiskDprs}</div>
                  <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-full shadow-inner">
                    <Shield className="h-6 w-6 text-red-500 dark:text-red-400" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  {stats.highRiskDprs > 0 
                    ? <span className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                        {`${stats.highRiskDprs} DPR${stats.highRiskDprs > 1 ? 's' : ''} requiring attention`}
                      </span>
                    : 'No high risk DPRs'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Risk Distribution Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-1 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/60">
                <CardTitle className="text-lg font-medium flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-indigo-500" />
                  Risk Distribution
                </CardTitle>
                <CardDescription>Breakdown of risk levels across all DPRs</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {stats.totalDprs === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Shield className="h-16 w-16 mx-auto mb-2 opacity-30" />
                    <p className="font-medium">No risk data available yet</p>
                    <p className="text-xs mt-2 text-gray-400 dark:text-gray-500 max-w-[200px] mx-auto">
                      Upload DPRs to see risk distribution analysis
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <span className="text-sm font-medium">High Risk</span>
                          </div>
                          <span className="font-bold bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-md text-sm">{riskDistribution.high}</span>
                        </div>
                        <Progress 
                          value={(riskDistribution.high / stats.totalDprs) * 100} 
                          className="h-2 rounded-full bg-red-100 dark:bg-red-950 [&>div]:bg-red-500" 
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                            <span className="text-sm font-medium">Medium Risk</span>
                          </div>
                          <span className="font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md text-sm">{riskDistribution.medium}</span>
                        </div>
                        <Progress 
                          value={(riskDistribution.medium / stats.totalDprs) * 100} 
                          className="h-2 rounded-full bg-amber-100 dark:bg-amber-950 [&>div]:bg-amber-500" 
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-sm font-medium">Low Risk</span>
                          </div>
                          <span className="font-bold bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-md text-sm">{riskDistribution.low}</span>
                        </div>
                        <Progress 
                          value={(riskDistribution.low / stats.totalDprs) * 100} 
                          className="h-2 rounded-full bg-green-100 dark:bg-green-950 [&>div]:bg-green-500" 
                        />
                      </div>
                      
                      {stats.totalDprs > 0 && (
                        <div className="mt-6 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Total analyzed:</span>
                            <span className="font-medium">{stats.totalDprs} DPRs</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          
            {/* Quick Actions & Performance Analytics */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Actions Card */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/60">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-indigo-500" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common tasks and operations</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      className="h-auto py-6 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg rounded-xl"
                      onClick={() => router.push('/dprs/upload')}
                    >
                      <div className="bg-white/20 p-3 rounded-full">
                        <Upload className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium">Upload DPR</span>
                    </Button>
                    
                    <Button
                      className="h-auto py-6 flex flex-col items-center justify-center space-y-3 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
                      variant="outline"
                      onClick={() => router.push('/dprs')}
                    >
                      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-full">
                        <FileText className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">All DPRs</span>
                    </Button>
                    
                    <Button
                      className="h-auto py-6 flex flex-col items-center justify-center space-y-3 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
                      variant="outline"
                      onClick={() => router.push('/reports')}
                    >
                      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-full">
                        <BarChart4 className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Analytics</span>
                    </Button>
                    
                    {user?.is_admin ? (
                      <Button
                        className="h-auto py-6 flex flex-col items-center justify-center space-y-3 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
                        variant="outline"
                        onClick={() => router.push('/users')}
                      >
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-full">
                          <Shield className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">User Management</span>
                      </Button>
                    ) : (
                      <Button
                        className="h-auto py-6 flex flex-col items-center justify-center space-y-3 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
                        variant="outline"
                        onClick={() => router.push('/risk-prediction')}
                      >
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-full">
                          <TrendingUp className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Risk Prediction</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Performance Card */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/60">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-indigo-500" />
                    DPR Processing Status
                  </CardTitle>
                  <CardDescription>Current workflow metrics</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {stats.totalDprs === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-full inline-flex items-center justify-center mb-4">
                        <Hourglass className="h-12 w-12 opacity-50 text-indigo-400" />
                      </div>
                      <p className="font-medium mb-2">No DPR data available yet</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 max-w-[240px] mx-auto">
                        Upload your first DPR to start monitoring processing metrics
                      </p>
                      <Button 
                        variant="outline" 
                        className="border-indigo-200 hover:border-indigo-300 dark:border-indigo-900 dark:hover:border-indigo-700"
                        onClick={() => router.push('/dprs/upload')}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload your first DPR
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm items-center">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Overall completion</span>
                          <Badge variant="outline" className={`
                            ${stats.progressPercentage === 100 
                              ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                              : 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800'}
                          `}>
                            {stats.progressPercentage}%
                          </Badge>
                        </div>
                        <Progress 
                          value={stats.progressPercentage} 
                          className={`h-3 rounded-full ${stats.progressPercentage === 100 ? '[&>div]:bg-green-500' : '[&>div]:bg-indigo-500'}`}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="relative bg-white dark:bg-slate-800 p-4 rounded-xl text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                          <div className="absolute top-0 left-0 w-full h-1 bg-green-500 rounded-t-xl"></div>
                          <div className="flex flex-col items-center">
                            <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-full mb-2">
                              <BadgeCheck className="h-5 w-5 text-green-500 dark:text-green-400" />
                            </div>
                            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                              {stats.evaluatedDprs}
                            </div>
                            <div className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">Completed</div>
                          </div>
                        </div>
                        
                        <div className="relative bg-white dark:bg-slate-800 p-4 rounded-xl text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 rounded-t-xl"></div>
                          <div className="flex flex-col items-center">
                            <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded-full mb-2">
                              <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                            </div>
                            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                              {stats.pendingDprs}
                            </div>
                            <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-1">In Progress</div>
                          </div>
                        </div>
                        
                        <div className="relative bg-white dark:bg-slate-800 p-4 rounded-xl text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 rounded-t-xl"></div>
                          <div className="flex flex-col items-center">
                            <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded-full mb-2">
                              <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />
                            </div>
                            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                              {stats.highRiskDprs}
                            </div>
                            <div className="text-xs font-medium text-red-600 dark:text-red-400 mt-1">Flagged</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Recent DPRs */}
          <div className="mb-8">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
              <CardHeader className="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                    Recent DPRs
                  </CardTitle>
                  <Link 
                    href="/dprs" 
                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-md"
                  >
                    View All
                    <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {recentDprs.length === 0 ? (
                  <div className="py-16 text-center text-gray-500 dark:text-gray-400">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-full inline-flex items-center justify-center mb-4">
                      <FileX className="h-12 w-12 opacity-50 text-indigo-400" />
                    </div>
                    <p className="font-medium mb-2">No DPRs uploaded yet</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 max-w-[240px] mx-auto">
                      Start by uploading your first DPR document for analysis
                    </p>
                    <Button 
                      onClick={() => router.push('/dprs/upload')}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload your first DPR
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider font-semibold">
                            <div className="flex items-center">
                              <FileText className="h-3.5 w-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                              Document
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider font-semibold">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                              Date
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider font-semibold">
                            <div className="flex items-center">
                              <Building className="h-3.5 w-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                              Department
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider font-semibold">
                            <div className="flex items-center">
                              <CircleCheck className="h-3.5 w-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                              Status
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider font-semibold">
                            <div className="flex items-center">
                              <BarChart2 className="h-3.5 w-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                              Risk Level
                            </div>
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider font-semibold">
                            <div className="flex items-center justify-end">
                              <Settings className="h-3.5 w-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                              Actions
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {recentDprs.map((dpr: any, index: number) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-md flex items-center justify-center mr-3">
                                  <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">
                                    {dpr.title}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    ID: {dpr.id.substring(0, 8)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                {new Date(dpr.uploadDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(dpr.uploadDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-indigo-400 mr-2"></div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dpr.department}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                                dpr.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                  : dpr.status === 'Evaluated'
                                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800'
                                  : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              }`}>
                                {dpr.status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
                                {dpr.status === 'Evaluated' && <BadgeCheck className="mr-1 h-3 w-3" />}
                                {dpr.status === 'Processing' && <Activity className="mr-1 h-3 w-3" />}
                                {dpr.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {dpr.riskLevel === 'High' ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800">
                                  <Shield className="mr-1 h-3 w-3" />
                                  High
                                </span>
                              ) : dpr.riskLevel === 'Medium' ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                  <Tag className="mr-1 h-3 w-3" />
                                  Medium
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                                  <BadgeCheck className="mr-1 h-3 w-3" />
                                  Low
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                onClick={() => router.push(`/dprs/${dpr.id}`)}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* System Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-1 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-indigo-500" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">AI Model Status</span>
                    </div>
                    <Badge className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800 px-2 py-0.5 rounded-md font-medium">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Last Model Update</span>
                    </div>
                    <span className="text-sm font-medium bg-gray-50 dark:bg-gray-800/60 px-2 py-0.5 rounded-md text-gray-700 dark:text-gray-300">Oct 05, 2025</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-indigo-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">System Version</span>
                    </div>
                    <span className="text-sm font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md">v2.3.1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Current Date</span>
                    </div>
                    <span className="text-sm font-medium bg-gray-50 dark:bg-gray-800/60 px-2 py-0.5 rounded-md text-gray-700 dark:text-gray-300">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-indigo-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {recentDprs.length === 0 ? (
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-full inline-flex items-center justify-center mb-3">
                      <Activity className="h-10 w-10 text-indigo-300 opacity-60" />
                    </div>
                    <p className="font-medium mb-1">No recent activity to display</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 max-w-[240px] mx-auto">
                      Activity will appear here once you start using the system
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentDprs.slice(0, 3).map((dpr: any, index: number) => (
                      <div key={index} className="flex items-start p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800/60 transition-colors">
                        <div className={`p-2 rounded-full mr-3 ${
                          dpr.status === 'Evaluated' ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' : 
                          dpr.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800' : 
                          'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                        }`}>
                          {dpr.status === 'Evaluated' ? (
                            <FileCheck className={`h-5 w-5 text-green-600 dark:text-green-400`} />
                          ) : dpr.status === 'Pending' ? (
                            <Clock className={`h-5 w-5 text-amber-600 dark:text-amber-400`} />
                          ) : (
                            <Activity className={`h-5 w-5 text-blue-600 dark:text-blue-400`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{dpr.title}</p>
                            <div className="flex items-center bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                              <Clock className="h-3 w-3 mr-1 opacity-70" />
                              {new Date(dpr.uploadDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {dpr.status === 'Evaluated' 
                              ? `${dpr.title} was evaluated with ${dpr.riskLevel.toLowerCase()} risk level` 
                              : dpr.status === 'Pending'
                              ? `${dpr.title} is awaiting evaluation`
                              : `${dpr.title} is currently being processed`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-950 py-6 text-sm text-slate-500 dark:text-slate-400 shadow-inner">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-indigo-50 dark:bg-indigo-950 p-2 rounded-md mr-3">
                <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">DPR Risk Assessment System</div>
                <div className="text-xs">&copy; {new Date().getFullYear()} Ministry of Development of North Eastern Region. All rights reserved.</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex space-x-6 mb-4 md:mb-0 md:mr-8">
                <Link href="/help" className="flex items-center text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <HelpCircle className="h-4 w-4 mr-1.5" />
                  Help Center
                </Link>
                <Link href="/user-manual" className="flex items-center text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  User Manual
                </Link>
              </div>
              <div className="flex space-x-4 text-xs">
                <Link href="/privacy-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Use</Link>
                <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</Link>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-center text-gray-400 dark:text-gray-500">
            Developed under Smart India Hackathon 2023 - AI/ML Solution for Daily Progress Report Risk Assessment
          </div>
        </div>
      </footer>
    </div>
  )
}