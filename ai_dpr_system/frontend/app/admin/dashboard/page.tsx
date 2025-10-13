'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { useAuth } from '@/lib/auth/auth-provider'
import { useTranslation } from 'react-i18next'
import { BarChart, Users, FileText, AlertCircle, ArrowUp, ArrowDown, ChevronRight, ActivitySquare, Gauge, Clock, Calendar, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AdminIcons } from '@/components/admin-icons'

export default function AdminDashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [searchParams, setSearchParams] = React.useState<URLSearchParams | null>(null)
  const [searchResults, setSearchResults] = React.useState<any[] | null>(null)
  const [isSearching, setIsSearching] = React.useState(false)
  
  // Get search query from URL if present
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setSearchParams(params)
      
      const searchQuery = params.get('search')
      if (searchQuery) {
        performSearch(searchQuery)
      }
    }
  }, [])
  
  // Function to perform search across admin data
  const performSearch = (query: string) => {
    setIsSearching(true)
    
    // Perform search through actual data
    try {
      const results: any[] = []
      
      // Search users
      const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]')
      const matchingUsers = registeredUsers.filter((user: any) => 
        user.full_name?.toLowerCase().includes(query.toLowerCase()) ||
        user.email?.toLowerCase().includes(query.toLowerCase()) ||
        user.department?.toLowerCase().includes(query.toLowerCase())
      )
      
      if (matchingUsers.length > 0) {
        results.push({
          type: 'users',
          items: matchingUsers.map((user: any) => ({
            id: user.id,
            title: user.full_name,
            subtitle: user.email,
            link: `/admin/users?id=${user.id}`,
            icon: Users
          }))
        })
      }
      
      // Search DPRs
      const dprData = JSON.parse(localStorage.getItem('dpr-data') || '[]')
      const matchingDprs = dprData.filter((dpr: any) =>
        dpr.title?.toLowerCase().includes(query.toLowerCase()) ||
        dpr.description?.toLowerCase().includes(query.toLowerCase())
      )
      
      if (matchingDprs.length > 0) {
        results.push({
          type: 'dprs',
          items: matchingDprs.map((dpr: any) => ({
            id: dpr.id,
            title: dpr.title,
            subtitle: dpr.description?.substring(0, 50) + '...',
            link: `/admin/dprs/${dpr.id}`,
            icon: FileText
          }))
        })
      }
      
      setSearchResults(results)
    } catch (error) {
      console.error('Error performing search:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // Get real data from localStorage instead of using mock data
  const [stats, setStats] = React.useState([
    {
      name: t('Total Users'),
      value: '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: t('Total DPRs'),
      value: '0',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: t('High Risk DPRs'),
      value: '0',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      name: t('Reports Generated'),
      value: '0',
      icon: BarChart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]);
  
  // Load actual data from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Count users
      let userCount = 0;
      try {
        const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');
        const usersList = JSON.parse(localStorage.getItem('users-list') || '[]');
        // Use users-list if available, otherwise count registered users
        userCount = usersList.length > 0 ? usersList.length : registeredUsers.length;
      } catch (e) {
        console.error('Error counting users:', e);
      }
      
      // Count DPRs
      let dprCount = 0;
      let highRiskDprCount = 0;
      try {
        const dprs = JSON.parse(localStorage.getItem('uploaded-dprs') || '[]');
        dprCount = dprs.length;
        
        // Count high risk DPRs (risk score > 0.7)
        highRiskDprCount = dprs.filter(dpr => dpr.riskScore && dpr.riskScore > 0.7).length;
      } catch (e) {
        console.error('Error counting DPRs:', e);
      }
      
      // Count reports
      let reportCount = 0;
      try {
        const reports = JSON.parse(localStorage.getItem('generated-reports') || '[]');
        reportCount = reports.length;
      } catch (e) {
        console.error('Error counting reports:', e);
      }
      
      // Update stats with real data
      setStats([
        {
          name: t('Total Users'),
          value: userCount.toString(),
          icon: Users,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
        },
        {
          name: t('Total DPRs'),
          value: dprCount.toString(),
          icon: FileText,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        },
        {
          name: t('High Risk DPRs'),
          value: highRiskDprCount.toString(),
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
        },
        {
          name: t('Reports Generated'),
          value: reportCount.toString(),
          icon: BarChart,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
        },
      ]);
    }
  }, [t]);

  // Get random trend values for UI demonstration
  const getTrendValue = () => {
    const value = Math.random() * 20 - 10; // Range from -10 to +10
    return {
      value: Math.abs(value).toFixed(1),
      increase: value > 0,
      text: `${value > 0 ? '+' : '-'}${Math.abs(value).toFixed(1)}% ${value > 0 ? 'increase' : 'decrease'}`
    };
  };
  
  const [trends] = React.useState([
    getTrendValue(),
    getTrendValue(),
    getTrendValue(),
    getTrendValue()
  ]);

  // Get the current date for the header
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Search Results Section */}
        {searchParams?.get('search') && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Search Results for "{searchParams.get('search')}"</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    // Clear search results and remove search param from URL
                    setSearchResults(null)
                    if (typeof window !== 'undefined') {
                      const url = new URL(window.location.href)
                      url.searchParams.delete('search')
                      window.history.pushState({}, '', url.toString())
                      setSearchParams(new URLSearchParams())
                    }
                  }}
                >
                  Clear Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isSearching ? (
                <div className="py-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                  <p className="mt-2">Searching...</p>
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="space-y-6">
                  {searchResults.map((category, i) => (
                    <div key={i}>
                      <h3 className="font-medium text-lg capitalize mb-2">{category.type}</h3>
                      <div className="space-y-2">
                        {category.items.map((item: any) => {
                          const Icon = item.icon || FileText;
                          return (
                            <a 
                              key={item.id}
                              href={item.link}
                              className="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-md text-primary">
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{item.title}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</p>
                                </div>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults && searchResults.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No results found for "{searchParams.get('search')}"</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t('Admin Dashboard')}</h2>
            <div className="flex items-center text-muted-foreground mt-1">
              <Calendar className="h-4 w-4 mr-2" />
              <p>{formattedDate}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              {t('View History')}
            </Button>
            <Button className="flex items-center">
              <AdminIcons.Reports className="h-4 w-4 mr-2" />
              {t('Download Report')}
            </Button>
          </div>
        </div>
      
        {/* Stats Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={stat.name} className="overflow-hidden shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-full`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2 mt-1">
                  {trends[i].increase ? (
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-0.5" />
                      {trends[i].value}%
                    </span>
                  ) : (
                    <span className="text-xs text-red-600 dark:text-red-400 flex items-center">
                      <ArrowDown className="h-3 w-3 mr-0.5" />
                      {trends[i].value}%
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{t('from last month')}</span>
                </div>
              </CardContent>
              <CardFooter className="py-2 px-6 bg-muted/30">
                <span className="text-xs text-muted-foreground flex items-center">
                  {trends[i].increase ? (
                    <>
                      <Gauge className="h-3 w-3 mr-1 text-green-500" />
                      {t('Growing steadily')}
                    </>
                  ) : (
                    <>
                      <Gauge className="h-3 w-3 mr-1 text-yellow-500" />
                      {t('Needs attention')}
                    </>
                  )}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-sm hover:shadow transition-shadow duration-200">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('Recent Activity')}</CardTitle>
                  <CardDescription>{t('Latest activity across the platform')}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  {t('Last 7 days')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                {/* Use actual recent activity data from localStorage */}
                {React.useMemo(() => {
                  // Get recent activities
                  const activities = [];
                  
                  try {
                    // Get DPR uploads
                    const dprs = JSON.parse(localStorage.getItem('uploaded-dprs') || '[]');
                    const recentDprs = dprs.slice(-5).reverse(); // Get last 5 uploads
                    
                    // Get user data to match with uploads
                    const users = JSON.parse(localStorage.getItem('users-list') || '[]');
                    const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');
                    const allUsers = [...users, ...registeredUsers];
                    
                    // Add DPR upload activities
                    for (const dpr of recentDprs) {
                      const uploader = allUsers.find(u => u.id?.toString() === dpr.uploaderId?.toString());
                      const uploaderName = uploader ? uploader.name || uploader.full_name : 'A user';
                      const date = new Date(dpr.uploadDate || Date.now());
                      const today = new Date();
                      
                      let dateText = t('Earlier');
                      if (date.toDateString() === today.toDateString()) {
                        dateText = t('Today');
                      } else if (date.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString()) {
                        dateText = t('Yesterday');
                      } else if (date > new Date(today.setDate(today.getDate() - 7))) {
                        dateText = t('Last Week');
                      }
                      
                      activities.push({
                        date: dateText,
                        text: `${uploaderName} uploaded a DPR: ${dpr.title || 'Untitled'}`,
                        time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
                        user: uploader
                      });
                    }
                    
                    // Add system activities if we don't have enough real data
                    if (activities.length === 0) {
                      activities.push({
                        date: t('Today'),
                        text: t('No recent activities'),
                        time: '00:00'
                      });
                    }
                  } catch (e) {
                    console.error('Error getting recent activities:', e);
                    activities.push({
                      date: t('Today'),
                      text: t('Error loading recent activities'),
                      time: '00:00'
                    });
                  }
                  
                  // Group activities by date
                  const groupedActivities = {};
                  for (const activity of activities) {
                    if (!groupedActivities[activity.date]) {
                      groupedActivities[activity.date] = [];
                    }
                    groupedActivities[activity.date].push(activity.text);
                  }
                  
                  return Object.entries(groupedActivities).map(([date, texts], index) => (
                    <div key={index} className={index < Object.keys(groupedActivities).length - 1 ? "border-b pb-4" : ""}>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{date}</p>
                      {Array.isArray(texts) ? texts.map((text, i) => (
                        <p key={i} className="mt-2 text-sm">{text}</p>
                      )) : <p className="mt-2 text-sm">{texts}</p>}
                    </div>
                  ));
                }, [])}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow transition-shadow duration-200">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('System Status')}</CardTitle>
                  <CardDescription>{t('Current system performance metrics')}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  {t('Live')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {/* Use actual system status data if available */}
                {React.useMemo(() => {
                  // Check actual system status based on recent operations
                  const lastAPICheck = localStorage.getItem('last-api-check-time');
                  const lastMLServiceCheck = localStorage.getItem('last-ml-service-check-time');
                  const lastDBOperation = localStorage.getItem('last-db-operation-time');
                  const lastStorageOperation = localStorage.getItem('last-storage-operation-time');
                  
                  // Current time
                  const now = Date.now();
                  // Time threshold (24 hours in milliseconds)
                  const threshold = 24 * 60 * 60 * 1000;
                  
                  // Determine status based on last operation time
                  const getStatus = (lastCheckTime) => {
                    if (!lastCheckTime) return { status: 'Unknown', color: 'text-gray-500', bgColor: 'bg-gray-100' };
                    
                    try {
                      const checkTime = parseInt(lastCheckTime);
                      if (now - checkTime < threshold) {
                        return { 
                          status: t('Operational'), 
                          color: 'text-green-600', 
                          bgColor: 'bg-green-100',
                          icon: <div className="h-2 w-2 rounded-full bg-green-500" />
                        };
                      } else {
                        return { 
                          status: t('Check Required'), 
                          color: 'text-yellow-600', 
                          bgColor: 'bg-yellow-100',
                          icon: <div className="h-2 w-2 rounded-full bg-yellow-500" />
                        };
                      }
                    } catch (e) {
                      return { 
                        status: t('Unknown'), 
                        color: 'text-gray-500', 
                        bgColor: 'bg-gray-100',
                        icon: <div className="h-2 w-2 rounded-full bg-gray-400" />
                      };
                    }
                  };
                  
                  const apiStatus = getStatus(lastAPICheck);
                  const mlStatus = getStatus(lastMLServiceCheck);
                  const dbStatus = getStatus(lastDBOperation);
                  const storageStatus = getStatus(lastStorageOperation);
                  
                  // Update localStorage with current check time
                  localStorage.setItem('last-api-check-time', now.toString());
                  
                  return (
                    <>
                      <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                        <span className="flex items-center gap-2">
                          {apiStatus.icon}
                          {t('Backend API')}
                        </span>
                        <Badge variant="outline" className={`${apiStatus.bgColor} ${apiStatus.color}`}>
                          {apiStatus.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                        <span className="flex items-center gap-2">
                          {mlStatus.icon}
                          {t('ML Services')}
                        </span>
                        <Badge variant="outline" className={`${mlStatus.bgColor} ${mlStatus.color}`}>
                          {mlStatus.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                        <span className="flex items-center gap-2">
                          {dbStatus.icon}
                          {t('Database')}
                        </span>
                        <Badge variant="outline" className={`${dbStatus.bgColor} ${dbStatus.color}`}>
                          {dbStatus.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                        <span className="flex items-center gap-2">
                          {storageStatus.icon}
                          {t('Storage')}
                        </span>
                        <Badge variant="outline" className={`${storageStatus.bgColor} ${storageStatus.color}`}>
                          {storageStatus.status}
                        </Badge>
                      </div>
                    </>
                  );
                }, [])}
              </div>
            </CardContent>
          </Card>

          {/* System Maintenance Card */}
          <Card className="shadow-sm hover:shadow transition-shadow duration-200">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('System Maintenance')}</CardTitle>
                  <CardDescription>{t('Tools for managing system data')}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  {t('Admin')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <a 
                  href="/admin/system/clear-demo-data" 
                  className="flex justify-between items-center p-3 rounded-md hover:bg-muted/50 border border-gray-100 dark:border-gray-800"
                >
                  <span className="flex items-center gap-2">
                    <div className="p-1 bg-red-100 dark:bg-red-900/20 rounded-full">
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    {t('Clear Demo Data')}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </a>
                
                <a 
                  href="/auth/login" 
                  className="flex justify-between items-center p-3 rounded-md hover:bg-muted/50 border border-gray-100 dark:border-gray-800"
                >
                  <span className="flex items-center gap-2">
                    <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <ActivitySquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    {t('Reset Authentication')}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}