'use client'

// This utility function helps with notifications management
// throughout the admin panel

// Define notification type
export interface AdminNotification {
  id: number
  text: string
  time: string
  read: boolean
}

/**
 * Add a new notification to the system
 * @param text The notification message
 * @returns The newly created notification object
 */
export function addAdminNotification(text: string): AdminNotification {
  // Get existing notifications
  const existingNotificationsStr = localStorage.getItem('admin-notifications') || '[]'
  let notifications: AdminNotification[] = []
  
  try {
    notifications = JSON.parse(existingNotificationsStr)
  } catch (e) {
    console.error('Error parsing notifications:', e)
    notifications = []
  }
  
  // Create a new notification
  const newNotification: AdminNotification = {
    id: Date.now(), // Use timestamp as unique ID
    text,
    time: getRelativeTimeString(new Date()),
    read: false
  }
  
  // Add to beginning of array (newest first)
  notifications.unshift(newNotification)
  
  // Keep only the latest 50 notifications to prevent storage issues
  if (notifications.length > 50) {
    notifications = notifications.slice(0, 50)
  }
  
  // Save back to localStorage
  localStorage.setItem('admin-notifications', JSON.stringify(notifications))
  
  return newNotification
}

/**
 * Mark all notifications as read
 */
export function markAllNotificationsAsRead(): void {
  const existingNotificationsStr = localStorage.getItem('admin-notifications') || '[]'
  let notifications: AdminNotification[] = []
  
  try {
    notifications = JSON.parse(existingNotificationsStr)
    
    // Mark all as read
    notifications = notifications.map(notif => ({
      ...notif,
      read: true
    }))
    
    // Save back to localStorage
    localStorage.setItem('admin-notifications', JSON.stringify(notifications))
  } catch (e) {
    console.error('Error marking notifications as read:', e)
  }
}

/**
 * Mark a specific notification as read
 * @param id The ID of the notification to mark as read
 */
export function markNotificationAsRead(id: number): void {
  const existingNotificationsStr = localStorage.getItem('admin-notifications') || '[]'
  let notifications: AdminNotification[] = []
  
  try {
    notifications = JSON.parse(existingNotificationsStr)
    
    // Find and mark the specific notification
    notifications = notifications.map(notif => {
      if (notif.id === id) {
        return {
          ...notif,
          read: true
        }
      }
      return notif
    })
    
    // Save back to localStorage
    localStorage.setItem('admin-notifications', JSON.stringify(notifications))
  } catch (e) {
    console.error('Error marking notification as read:', e)
  }
}

/**
 * Get a formatted relative time string (e.g., "5 minutes ago")
 * @param date The date to format
 * @returns A human-readable relative time string
 */
/**
 * Delete a notification by ID
 * @param id The ID of the notification to delete
 */
export function deleteNotification(id: number): void {
  try {
    const existingNotificationsStr = localStorage.getItem('admin-notifications') || '[]'
    let notifications = JSON.parse(existingNotificationsStr)
    
    // Filter out the notification to delete
    notifications = notifications.filter((notif: AdminNotification) => notif.id !== id)
    
    // Save back to localStorage
    localStorage.setItem('admin-notifications', JSON.stringify(notifications))
  } catch (e) {
    console.error('Error deleting notification:', e)
  }
}

/**
 * Delete all read notifications
 */
export function deleteReadNotifications(): void {
  try {
    const existingNotificationsStr = localStorage.getItem('admin-notifications') || '[]'
    let notifications = JSON.parse(existingNotificationsStr)
    
    // Filter out read notifications
    notifications = notifications.filter((notif: AdminNotification) => !notif.read)
    
    // Save back to localStorage
    localStorage.setItem('admin-notifications', JSON.stringify(notifications))
  } catch (e) {
    console.error('Error deleting read notifications:', e)
  }
}

function getRelativeTimeString(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  
  if (diffSeconds < 60) {
    return 'just now'
  }
  
  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`
  }
  
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  }
  
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
  }
  
  // Fall back to date format for older notifications
  return date.toLocaleDateString()
}