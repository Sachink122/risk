'use client'

import { addAdminNotification } from '@/lib/admin/notifications'

// Define user activity type
export interface UserActivity {
  id: number
  user: string
  action: string
  details: string
  timestamp: number
  module: string
  ip?: string
}

// Define activity modules
export enum ActivityModule {
  AUTH = 'authentication',
  REPORTS = 'reports',
  USERS = 'users',
  RISKS = 'risk-assessment',
  DPR = 'dpr',
  ADMIN = 'admin',
  SYSTEM = 'system'
}

/**
 * Record user activity to localStorage
 * @param user User identifier (email, name, or ID)
 * @param action The action performed
 * @param details Additional details about the action
 * @param module The module where the action occurred
 * @param notify Whether to create an admin notification for this activity
 * @returns The recorded activity object
 */
export function recordUserActivity(
  user: string,
  action: string,
  details: string,
  module: ActivityModule,
  notify = false
): UserActivity {
  // Create activity object
  const activity: UserActivity = {
    id: Date.now(),
    user,
    action,
    details,
    timestamp: Date.now(),
    module,
    ip: typeof window !== 'undefined' ? window.location.hostname : undefined
  }

  // Get existing activities
  const existingActivitiesStr = localStorage.getItem('user-activities') || '[]'
  let activities: UserActivity[] = []
  
  try {
    activities = JSON.parse(existingActivitiesStr)
  } catch (e) {
    console.error('Error parsing activities:', e)
    activities = []
  }
  
  // Add new activity to beginning (newest first)
  activities.unshift(activity)
  
  // Keep only the latest 100 activities to prevent storage issues
  if (activities.length > 100) {
    activities = activities.slice(0, 100)
  }
  
  // Save back to localStorage
  localStorage.setItem('user-activities', JSON.stringify(activities))
  
  // Create an admin notification if requested
  if (notify) {
    addAdminNotification(`${user} ${action}: ${details}`)
  }
  
  return activity
}

/**
 * Get formatted date for an activity
 * @param timestamp The timestamp to format
 * @returns Formatted date string
 */
export function getActivityDate(timestamp: number): string {
  try {
    // Check if timestamp is valid
    if (!timestamp || isNaN(timestamp)) {
      return 'Invalid date'
    }
    return new Date(timestamp).toLocaleString()
  } catch (error) {
    console.error('Error formatting activity date:', error)
    return 'Invalid date'
  }
}

/**
 * Get all user activities
 * @returns Array of user activities
 */
export function getAllUserActivities(): UserActivity[] {
  if (typeof window === 'undefined') return []
  
  const activitiesStr = localStorage.getItem('user-activities') || '[]'
  try {
    return JSON.parse(activitiesStr)
  } catch (e) {
    console.error('Error parsing activities:', e)
    return []
  }
}

/**
 * Filter user activities by module
 * @param module The module to filter by
 * @returns Filtered activities
 */
export function getActivitiesByModule(module: ActivityModule): UserActivity[] {
  const activities = getAllUserActivities()
  return activities.filter(activity => activity.module === module)
}

/**
 * Filter user activities by user
 * @param user The user to filter by
 * @returns Filtered activities
 */
export function getActivitiesByUser(user: string): UserActivity[] {
  const activities = getAllUserActivities()
  return activities.filter(activity => activity.user === user)
}