
'use client'

// Notifications utilities used throughout the admin panel

// Define normalized notification type used by UI components
export interface AdminNotification {
  id: number
  title: string
  description: string
  timestamp: string // ISO string
  priority: 'low' | 'medium' | 'high' | 'critical'
  type: 'system' | 'risk' | 'user'
  read: boolean
}

// Back-compat normalizer for older stored items (with keys: text, time)
function normalizeNotification(raw: any): AdminNotification {
  const nowIso = new Date().toISOString()
  return {
    id: typeof raw?.id === 'number' ? raw.id : Number(raw?.id) || Date.now(),
    title: typeof raw?.title === 'string' && raw.title.length > 0 ? raw.title : 'Notification',
    description: typeof raw?.description === 'string' ? raw.description : (typeof raw?.text === 'string' ? raw.text : ''),
    timestamp: typeof raw?.timestamp === 'string' && !Number.isNaN(Date.parse(raw.timestamp))
      ? raw.timestamp
      : (typeof raw?.time === 'string' && !Number.isNaN(Date.parse(raw.time)) ? new Date(raw.time).toISOString() : nowIso),
    priority: (['low','medium','high','critical'] as const).includes(raw?.priority)
      ? raw.priority
      : 'low',
    type: (['system','risk','user'] as const).includes(raw?.type)
      ? raw.type
      : 'system',
    read: Boolean(raw?.read)
  }
}

function readStored(): AdminNotification[] {
  const str = localStorage.getItem('admin-notifications') || '[]'
  try {
    const arr = JSON.parse(str)
    if (!Array.isArray(arr)) return []
    return arr.map(normalizeNotification)
  } catch (e) {
    console.error('Error parsing notifications:', e)
    return []
  }
}

function writeStored(items: AdminNotification[]) {
  localStorage.setItem('admin-notifications', JSON.stringify(items))
}

/**
 * Add a new notification to the system
 * @param text The notification message
 * @returns The newly created notification object
 */
export function addAdminNotification(text: string): AdminNotification {
  const notifications = readStored()
  // Create a new normalized notification
  const newNotification: AdminNotification = {
    id: Date.now(),
    title: 'System Update',
    description: text,
    timestamp: new Date().toISOString(),
    priority: 'low',
    type: 'system',
    read: false,
  }
  // Add to beginning of array (newest first)
  notifications.unshift(newNotification)
  // Keep only the latest 50 notifications to prevent storage issues
  if (notifications.length > 50) {
    notifications.splice(50)
  }
  writeStored(notifications)
  return newNotification
}

/**
 * Mark all notifications as read
 */
export function markAllNotificationsAsRead(): void {
  const notifications = readStored().map(n => ({ ...n, read: true }))
  writeStored(notifications)
}

/**
 * Mark a specific notification as read
 * @param id The ID of the notification to mark as read
 */
export function markNotificationAsRead(id: number): void {
  const notifications = readStored().map(n => n.id === id ? { ...n, read: true } : n)
  writeStored(notifications)
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
  const notifications = readStored().filter(n => n.id !== id)
  writeStored(notifications)
}

/**
 * Delete all read notifications
 */
export function deleteReadNotifications(): void {
  const notifications = readStored().filter(n => !n.read)
  writeStored(notifications)
}

/**
 * Fetch all admin notifications (normalized)
 */
export function getAllNotifications(): AdminNotification[] {
  return readStored()
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