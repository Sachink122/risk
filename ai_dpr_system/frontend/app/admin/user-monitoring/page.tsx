'use client'

import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ActivityModule, recordUserActivity as recordActivity, getAllUserActivities, getActivityDate } from '@/lib/admin/user-activities'
import { 
  Activity, 
  Users, 
  Clock, 
  CalendarRange, 
  Download, 
  FileSpreadsheet,
  Search,
  MoreHorizontal,
  ArrowUpDown,
  Filter,
  UserCheck,
  MousePointer,
  LogIn,
  LogOut,
  File,
  AlertTriangle,
  Eye,
  BarChart,
  Lock
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Define activity types for better type checking
type ActivityType = 'login' | 'logout' | 'view' | 'edit' | 'delete' | 'upload' | 'download' | 'search' | 'report' | 'risk_assessment' | 'access_denied' | 'settings_change'

// Interface for user activity
interface UserActivity {
  id: string
  userId: string
  userName: string
  userEmail: string
  userAvatar?: string
  activityType: ActivityType
  description: string
  resource?: string
  timestamp: string
  ipAddress?: string
  deviceInfo?: string
  status?: 'success' | 'warning' | 'error'
  location?: string
}

export default function UserMonitoringPage() {
  // State for user activities
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<UserActivity[]>([])
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activityTypeFilter, setActivityTypeFilter] = useState<ActivityType | 'all'>('all')
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'week' | 'month' | 'all'>('all')
  const [isLoading, setIsLoading] = useState(true)
  
  // State for new activity format
  const [newActivities, setNewActivities] = useState<any[]>([])
  
  // Mock user data
  const [users, setUsers] = useState<{id: string, name: string, email: string, avatar?: string, status: 'active' | 'inactive'}[]>([])
  
  // Get user data and activities
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      
      try {
        // Get users from localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]')
        const mappedUsers = registeredUsers.map((user: any) => ({
          id: user.id || Math.random().toString(36).substr(2, 9),
          name: user.full_name || 'Unknown User',
          email: user.email || '',
          avatar: user.profile_image || undefined,
          status: 'active' as const
        }))
        setUsers(mappedUsers)
        
        // Get actual activities or create empty array if none exist
        let userActivities: UserActivity[] = []
        
        // Try to get real activities from localStorage - legacy format
        const storedActivities = localStorage.getItem('user-activities-real')
        if (storedActivities) {
          userActivities = JSON.parse(storedActivities)
        }
        
        // For new users with no activities, create initial login activities
        if (userActivities.length === 0 && mappedUsers.length > 0) {
          // If no activities found, create at least login activities for each user
          const initialActivities = mappedUsers.map(user => {
            const loginDate = new Date()
            loginDate.setHours(loginDate.getHours() - Math.floor(Math.random() * 24))
            
            // Create the initial activity
            const newActivity = {
              id: Math.random().toString(36).substr(2, 9),
              userId: user.id,
              userName: user.name,
              userEmail: user.email,
              userAvatar: user.avatar,
              activityType: 'login' as ActivityType,
              description: 'Logged in to the system',
              timestamp: loginDate.toISOString(),
              ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
              deviceInfo: 'Chrome/Windows',
              status: 'success' as const,
              location: 'System Access'
            } as UserActivity
            
            // Also record in our new format
            recordActivity(
              user.name,
              'login',
              'Initial login',
              ActivityModule.AUTH,
              false
            )
            
            return newActivity
          })
          
          userActivities = initialActivities
          localStorage.setItem('user-activities-real', JSON.stringify(userActivities))
        }
        
        // Also load new format activities
        const newFormatActivities = getAllUserActivities()
        setNewActivities(newFormatActivities)
        
        setActivities(userActivities)
        setFilteredActivities(userActivities)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Filter activities based on search query, activity type, and date
  useEffect(() => {
    let filtered = [...activities]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(activity => 
        activity.userName.toLowerCase().includes(query) ||
        activity.userEmail.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        (activity.resource && activity.resource.toLowerCase().includes(query))
      )
    }
    
    // Apply activity type filter
    if (activityTypeFilter !== 'all') {
      filtered = filtered.filter(activity => activity.activityType === activityTypeFilter)
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      const monthAgo = new Date(today)
      monthAgo.setDate(monthAgo.getDate() - 30)
      
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.timestamp)
        
        switch (dateFilter) {
          case 'today':
            return activityDate >= today
          case 'yesterday':
            return activityDate >= yesterday && activityDate < today
          case 'week':
            return activityDate >= weekAgo
          case 'month':
            return activityDate >= monthAgo
          default:
            return true
        }
      })
    }
    
    setFilteredActivities(filtered)
  }, [searchQuery, activityTypeFilter, dateFilter, activities])
  
  // Define activity helpers
  const getActivityDescription = (type: ActivityType, resource?: string): string => {
    const descriptions: Record<ActivityType, string> = {
      'login': 'Logged in to the system',
      'logout': 'Logged out from the system',
      'view': 'Viewed resource',
      'edit': 'Edited resource',
      'delete': 'Deleted resource',
      'upload': 'Uploaded file to',
      'download': 'Downloaded file from',
      'search': 'Searched for content',
      'report': 'Generated report',
      'risk_assessment': 'Performed risk assessment',
      'access_denied': 'Attempted unauthorized access to',
      'settings_change': 'Changed settings for'
    }
    
    return resource ? `${descriptions[type]} ${resource}` : descriptions[type]
  }
  
  // Map our ActivityType to our utility's ActivityModule for recording activities
  const getModuleForActivityType = (activityType: ActivityType): ActivityModule => {
    switch (activityType) {
      case 'login':
      case 'logout':
        return ActivityModule.AUTH
      case 'risk_assessment':
        return ActivityModule.RISKS
      case 'report':
        return ActivityModule.REPORTS
      case 'settings_change':
        return ActivityModule.ADMIN
      default:
        return ActivityModule.SYSTEM
    }
  }
  
  // Function to create a new activity and add it to storage using our utility
  const recordUserActivity = (user: any, activityType: ActivityType, resource?: string, status: 'success' | 'warning' | 'error' = 'success') => {
    const module = getModuleForActivityType(activityType)
    const userName = user.name || 'Unknown User'
    const details = resource ? `${resource}` : ''
    
    // Record activity using our utility
    recordActivity(
      userName,
      activityType,
      details,
      module,
      true // Notify admin about all user monitoring activities
    )
    
    // Also maintain backward compatibility with the existing system
    // This is for transition period only, could be removed later
    const newActivity: UserActivity = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userAvatar: user.avatar,
      activityType,
      description: getActivityDescription(activityType, resource),
      resource,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1',
      deviceInfo: 'Browser/OS',
      status,
      location: 'System'
    }
    
    // Get existing activities
    const existingActivities = JSON.parse(localStorage.getItem('user-activities-real') || '[]')
    
    // Add new activity and save back to storage
    const updatedActivities = [newActivity, ...existingActivities]
    localStorage.setItem('user-activities-real', JSON.stringify(updatedActivities))
    
    return newActivity
  }
  
  // Format timestamp to readable date
  const formatTimestamp = (timestamp: string) => {
    try {
      // Check if timestamp is valid
      if (!timestamp || isNaN(Date.parse(timestamp))) {
        return 'Invalid date'
      }
      const date = new Date(timestamp)
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date)
    } catch (error) {
      console.error('Error formatting timestamp:', error)
      return 'Invalid date'
    }
  }
  
  // Get activity icon based on type
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'login':
        return <LogIn className="h-4 w-4" />
      case 'logout':
        return <LogOut className="h-4 w-4" />
      case 'view':
        return <Eye className="h-4 w-4" />
      case 'edit':
        return <File className="h-4 w-4" />
      case 'delete':
        return <AlertTriangle className="h-4 w-4" />
      case 'upload':
        return <ArrowUpDown className="h-4 w-4" />
      case 'download':
        return <Download className="h-4 w-4" />
      case 'search':
        return <Search className="h-4 w-4" />
      case 'report':
        return <FileSpreadsheet className="h-4 w-4" />
      case 'risk_assessment':
        return <AlertTriangle className="h-4 w-4" />
      case 'access_denied':
        return <Lock className="h-4 w-4" />
      case 'settings_change':
        return <UserCheck className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }
  
  // Get activity badge color based on type
  const getActivityBadge = (type: ActivityType) => {
    switch (type) {
      case 'login':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Login</Badge>
      case 'logout':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Logout</Badge>
      case 'view':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">View</Badge>
      case 'edit':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Edit</Badge>
      case 'delete':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Delete</Badge>
      case 'upload':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Upload</Badge>
      case 'download':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Download</Badge>
      case 'search':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">Search</Badge>
      case 'report':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">Report</Badge>
      case 'risk_assessment':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">Risk Assessment</Badge>
      case 'access_denied':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Access Denied</Badge>
      case 'settings_change':
        return <Badge variant="outline" className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">Settings</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Success</Badge>
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Warning</Badge>
      case 'error':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  
  // Toggle selecting all activities
  const toggleSelectAll = () => {
    // Record this admin action
    if (users.length > 0) {
      const adminUser = users[0]
      recordUserActivity(adminUser, 'search', 'User Activities')
    }
    
    if (selectedActivities.length === filteredActivities.length) {
      setSelectedActivities([])
    } else {
      setSelectedActivities(filteredActivities.map(activity => activity.id))
    }
  }
  
  // Toggle selecting a single activity
  const toggleSelectActivity = (id: string) => {
    if (selectedActivities.includes(id)) {
      setSelectedActivities(selectedActivities.filter(activityId => activityId !== id))
    } else {
      setSelectedActivities([...selectedActivities, id])
    }
  }
  
  // Export selected activities as CSV
  const exportSelectedActivities = () => {
    // Record this admin action
    if (users.length > 0) {
      const adminUser = users[0]
      recordUserActivity(adminUser, 'download', 'Activity Export')
    }
    
    // Get activities to export (either selected or all filtered)
    const activitiesToExport = selectedActivities.length > 0
      ? filteredActivities.filter(activity => selectedActivities.includes(activity.id))
      : filteredActivities
    
    // Create CSV header
    const headers = [
      'User',
      'Email',
      'Activity',
      'Description',
      'Resource',
      'Date & Time',
      'IP Address',
      'Device',
      'Status',
      'Location'
    ]
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...activitiesToExport.map(activity => [
        `"${activity.userName}"`,
        `"${activity.userEmail}"`,
        `"${activity.activityType}"`,
        `"${activity.description}"`,
        `"${activity.resource || ''}"`,
        `"${formatTimestamp(activity.timestamp)}"`,
        `"${activity.ipAddress || ''}"`,
        `"${activity.deviceInfo || ''}"`,
        `"${activity.status || ''}"`,
        `"${activity.location || ''}"`,
      ].join(','))
    ].join('\n')
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `user-activities-${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // Generate a PDF report of activities
  const generateReport = () => {
    // In a real application, this would use a PDF generation library
    alert('Report generation would use a library like jsPDF to create a PDF report of user activities')
    
    // For demonstration purposes, we'll just download the CSV
    exportSelectedActivities()
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        heading="User Monitoring"
        subheading="Track and analyze user activity across the system"
        icon={<Activity className="h-6 w-6" />}
        actions={
          <>
            <Button variant="outline" onClick={exportSelectedActivities}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={generateReport}>
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </>
        }
      />
      
      <Tabs defaultValue="activities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activities">
            <Activity className="h-4 w-4 mr-2" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="unified">
            <Activity className="h-4 w-4 mr-2" />
            Unified Activities
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        {/* Activity Log Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input 
                      placeholder="Search activities..."
                      className="pl-9 pr-4"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={activityTypeFilter} onValueChange={(value) => setActivityTypeFilter(value as any)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Activity Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activities</SelectItem>
                      <SelectItem value="login">Login</SelectItem>
                      <SelectItem value="logout">Logout</SelectItem>
                      <SelectItem value="view">View</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                      <SelectItem value="upload">Upload</SelectItem>
                      <SelectItem value="download">Download</SelectItem>
                      <SelectItem value="search">Search</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="risk_assessment">Risk Assessment</SelectItem>
                      <SelectItem value="access_denied">Access Denied</SelectItem>
                      <SelectItem value="settings_change">Settings Change</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as any)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="week">Past Week</SelectItem>
                      <SelectItem value="month">Past Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="relative">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30px]">
                          <Checkbox 
                            checked={selectedActivities.length === filteredActivities.length && filteredActivities.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="w-[200px]">User</TableHead>
                        <TableHead className="w-[100px]">Activity</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[160px]">Date & Time</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="w-[50px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActivities.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            {searchQuery || activityTypeFilter !== 'all' || dateFilter !== 'all' ? 
                              'No activities match your search criteria' : 
                              'No activities found'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredActivities.slice(0, 50).map(activity => (
                          <TableRow key={activity.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedActivities.includes(activity.id)}
                                onCheckedChange={() => toggleSelectActivity(activity.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  {activity.userAvatar ? (
                                    <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                                  ) : null}
                                  <AvatarFallback>{activity.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{activity.userName}</div>
                                  <div className="text-xs text-gray-500">{activity.userEmail}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getActivityBadge(activity.activityType)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="p-1 rounded-full bg-primary/10">
                                  {getActivityIcon(activity.activityType)}
                                </span>
                                <span>{activity.description}</span>
                              </div>
                              {activity.ipAddress && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {activity.ipAddress} • {activity.location}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="font-medium">
                                  {formatTimestamp(activity.timestamp)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {activity.deviceInfo}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(activity.status || 'success')}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Export</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">Flag as Suspicious</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  
                  {filteredActivities.length > 50 && (
                    <div className="text-center py-4 text-sm text-gray-500">
                      Showing 50 of {filteredActivities.length} activities. Refine your search to see more specific results.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Unified Activities Tab - Shows activities from the new format */}
        <TabsContent value="unified" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unified Activity Log</CardTitle>
              <CardDescription>
                All user activities recorded in the new unified format.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="relative">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead>Date & Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newActivities.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No activities recorded yet. Activities will appear here as users interact with the system.
                          </TableCell>
                        </TableRow>
                      ) : (
                        newActivities.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{activity.user ? activity.user.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{activity.user}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                {activity.action}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">{activity.details}</p>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                {activity.module}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{getActivityDate(activity.timestamp)}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>Users who have logged in or performed actions in the system recently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {users.map(user => {
                  const userActivities = activities.filter(a => a.userId === user.id)
                  const lastActivity = userActivities[0]
                  
                  return (
                    <Card key={user.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col items-center p-6 pb-4">
                          <Avatar className="h-16 w-16 mb-4">
                            {user.avatar ? (
                              <AvatarImage src={user.avatar} alt={user.name} />
                            ) : null}
                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <h3 className="font-medium text-lg">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <div className="mt-2">
                            {user.status === 'active' ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
                            ) : (
                              <Badge variant="outline">Inactive</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="border-t dark:border-gray-800 p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">Activities:</span>
                              <span className="font-medium">{userActivities.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">Last active:</span>
                              <span className="font-medium">
                                {lastActivity ? formatTimestamp(lastActivity.timestamp) : 'Never'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">Last activity:</span>
                              <span className="font-medium">
                                {lastActivity ? lastActivity.activityType : 'None'}
                              </span>
                            </div>
                          </div>
                          
                          <Button className="w-full mt-4" variant="outline">
                            View Activity
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Analytics</CardTitle>
              <CardDescription>Overview of user activity patterns and statistics</CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <div className="text-center py-8">
                <p>Analytics visualization would be displayed here.</p>
                <p className="text-gray-500 mt-2">This would typically include charts and graphs of user activities.</p>
              </div>
              
              {/* Activity Statistics */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-4">
                {[
                  { title: 'Total Activities', value: activities.length, icon: Activity },
                  { title: 'Login Events', value: activities.filter(a => a.activityType === 'login').length, icon: LogIn },
                  { title: 'Risk Events', value: activities.filter(a => a.activityType === 'risk_assessment').length, icon: AlertTriangle },
                  { title: 'Security Events', value: activities.filter(a => a.status === 'warning' || a.status === 'error').length, icon: Lock }
                ].map((stat, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{stat.title}</p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-full">
                          <stat.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}