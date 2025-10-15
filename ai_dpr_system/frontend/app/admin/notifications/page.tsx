'use client'

import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, CheckCircle, AlertCircle, Clock, Trash, RefreshCw } from 'lucide-react'
import { AdminNotification, markAllNotificationsAsRead, markNotificationAsRead, deleteNotification, deleteReadNotifications } from '@/lib/admin/notifications'

export default function NotificationsPage() {
  // Use real notifications from localStorage
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load notifications from localStorage
  useEffect(() => {
    loadNotifications()
  }, [])
  
  const loadNotifications = () => {
    setIsLoading(true)
    try {
      const savedNotifications = localStorage.getItem('admin-notifications') || '[]'
      const parsedNotifications = JSON.parse(savedNotifications)
      setNotifications(parsedNotifications)
    } catch (error) {
      console.error('Error loading notifications:', error)
      setNotifications([])
    } finally {
      setIsLoading(false)
    }
  }

  // Function to format the timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      // Check if timestamp is a valid date string
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

  // Function to get relative time
  const getRelativeTime = (timestamp: string) => {
    try {
      // Check if timestamp is valid
      if (!timestamp || isNaN(Date.parse(timestamp))) {
        return 'Unknown time'
      }

      const now = new Date()
      const date = new Date(timestamp)
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      
      if (diffInMinutes < 1) {
        return 'Just now'
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
      } else if (diffInMinutes < 24 * 60) {
        const hours = Math.floor(diffInMinutes / 60)
        return `${hours} hour${hours === 1 ? '' : 's'} ago`
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60))
      return `${days} day${days === 1 ? '' : 's'} ago`
    }
    } catch (error) {
      console.error('Error calculating relative time:', error)
      return 'Unknown time'
    }
  }

  // Function to mark a notification as read
  const markAsRead = (id: number) => {
    markNotificationAsRead(id)
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    markAllNotificationsAsRead()
    setNotifications(notifications.map(notification => ({ ...notification, read: true })))
  }

  // Function to delete a notification
  const handleDeleteNotification = (id: number) => {
    // Call the utility function
    deleteNotification(id)
    // Update local state
    setNotifications(notifications.filter(notification => notification.id !== id))
  }
  
  // Alias for backward compatibility (to avoid changing all occurrences)
  const deleteNotification = handleDeleteNotification

  // Function to clear all read notifications
  const clearReadNotifications = () => {
    // Call the utility function
    deleteReadNotifications()
    // Update local state
    setNotifications(notifications.filter(notification => !notification.read))
  }

  // Filter notifications
  const unreadNotifications = notifications.filter(notification => !notification.read)
  const readNotifications = notifications.filter(notification => notification.read)

  // Function to get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Low</Badge>
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Medium</Badge>
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">High</Badge>
      case 'critical':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Critical</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Notifications"
        subheading="View and manage system notifications"
        icon={<Bell className="h-6 w-6" />}
      />

      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadNotifications.length === 0}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearReadNotifications}
            disabled={readNotifications.length === 0}
          >
            <Trash className="mr-2 h-4 w-4" />
            Clear read notifications
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="outline" className="ml-2 bg-gray-100 dark:bg-gray-800">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {unreadNotifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="risk">Risk Alerts</TabsTrigger>
          <TabsTrigger value="user">User</TabsTrigger>
        </TabsList>

        {/* All Notifications */}
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Notification</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[150px]">Time</TableHead>
                    <TableHead className="w-[100px]">Priority</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No notifications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    notifications.map(notification => (
                      <TableRow key={notification.id} className={notification.read ? 'opacity-70' : ''}>
                        <TableCell className="font-medium">
                          {notification.title}
                        </TableCell>
                        <TableCell>{notification.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <span className="text-xs font-medium flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {getRelativeTime(notification.timestamp)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(notification.priority)}
                        </TableCell>
                        <TableCell>
                          {notification.read ? (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                              Read
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              Unread
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="sr-only">Mark as read</span>
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash className="h-4 w-4 text-red-600" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unread Notifications */}
        <TabsContent value="unread">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Notification</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[150px]">Time</TableHead>
                    <TableHead className="w-[100px]">Priority</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unreadNotifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No unread notifications
                      </TableCell>
                    </TableRow>
                  ) : (
                    unreadNotifications.map(notification => (
                      <TableRow key={notification.id}>
                        <TableCell className="font-medium">
                          {notification.title}
                        </TableCell>
                        <TableCell>{notification.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <span className="text-xs font-medium flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {getRelativeTime(notification.timestamp)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(notification.priority)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash className="h-4 w-4 text-red-600" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Filter tabs for system, risk, and user notifications */}
        {['system', 'risk', 'user'].map(type => (
          <TabsContent key={type} value={type}>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Notification</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[150px]">Time</TableHead>
                      <TableHead className="w-[100px]">Priority</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.filter(n => n.type === type).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No {type} notifications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      notifications
                        .filter(n => n.type === type)
                        .map(notification => (
                          <TableRow key={notification.id} className={notification.read ? 'opacity-70' : ''}>
                            <TableCell className="font-medium">
                              {notification.title}
                            </TableCell>
                            <TableCell>{notification.description}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTimestamp(notification.timestamp)}
                                </span>
                                <span className="text-xs font-medium flex items-center mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {getRelativeTime(notification.timestamp)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getPriorityBadge(notification.priority)}
                            </TableCell>
                            <TableCell>
                              {notification.read ? (
                                <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                  Read
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                  Unread
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                {!notification.read && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="sr-only">Mark as read</span>
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  <Trash className="h-4 w-4 text-red-600" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}