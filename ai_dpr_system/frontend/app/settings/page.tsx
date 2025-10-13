'use client'

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ThemeToggle } from '@/components/theme-toggle'
import { useState, useRef, useEffect } from 'react'
import { Camera, Upload, Trash2, CheckCircle, User, Bell, Palette } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const defaultSettings = {
    fullName: 'John Doe',
    email: 'user@example.com',
    department: 'Department of North Eastern Region',
    designation: 'Project Analyst',
    notificationsEnabled: true,
    emailNotifications: true,
    inAppNotifications: true,
    language: i18n.language || 'en',
    profileImage: '',
  }
  
  const [userSettings, setUserSettings] = useState(defaultSettings)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Import theme context for applying theme
  const { setTheme } = useTheme()
  
  // Load settings from localStorage when component mounts
  useEffect(() => {
    const loadSettings = () => {
      try {
        // First, check if user is admin
        let isAdmin = false;
        const currentUserStr = localStorage.getItem('current-user')
        
        if (currentUserStr) {
          const userData = JSON.parse(currentUserStr)
          isAdmin = userData && userData.is_admin === true
          
          // Update user profile info regardless of admin status
          if (userData && userData.full_name) {
            setUserSettings(prevSettings => ({
              ...prevSettings,
              fullName: userData.full_name || prevSettings.fullName,
              department: userData.department || prevSettings.department,
            }))
          }
        }
        
        // For admins, check adminSettings first for profile image
        if (isAdmin) {
          const adminSettings = localStorage.getItem('adminSettings')
          if (adminSettings) {
            const parsedAdminSettings = JSON.parse(adminSettings)
            if (parsedAdminSettings.profileImage) {
              setUserSettings(prevSettings => ({
                ...prevSettings,
                profileImage: parsedAdminSettings.profileImage
              }))
            }
          }
        }
        
        // Load regular user settings (for non-admins or for other settings besides profile image)
        const savedSettings = localStorage.getItem('userSettings')
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings)
          
          // For admin, only apply non-profile settings from userSettings
          // For non-admin, apply all settings
          if (isAdmin) {
            const { profileImage, ...otherSettings } = parsedSettings
            setUserSettings(prevSettings => ({
              ...prevSettings,
              ...otherSettings
            }))
          } else {
            setUserSettings(prevSettings => ({
              ...prevSettings,
              ...parsedSettings
            }))
          }
          
          // Update language if it was saved
          if (parsedSettings.language && parsedSettings.language !== i18n.language) {
            i18n.changeLanguage(parsedSettings.language)
          }
          
          // Apply saved theme if it exists
          if (parsedSettings.theme) {
            setTheme(parsedSettings.theme)
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
    
    // Load settings initially
    loadSettings()
    
    // Set up listener for changes in other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userSettings' || event.key === 'current-user' || event.key === 'adminSettings') {
        loadSettings()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [i18n, setTheme])

  const handleLanguageChange = (value: string) => {
    setUserSettings(prev => ({ ...prev, language: value }))
    i18n.changeLanguage(value)
  }

  const handleNotificationChange = (checked: boolean) => {
    setUserSettings(prev => ({ ...prev, notificationsEnabled: checked }))
  }
  
  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      
      // Create a URL for the file
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setUserSettings(prev => ({ ...prev, profileImage: base64Image }))
        setIsUploading(false)
        
        // Save image to appropriate storage based on user type
        try {
          // Check if user is admin
          const currentUserStr = localStorage.getItem('current-user')
          const userData = currentUserStr ? JSON.parse(currentUserStr) : null
          const isAdmin = userData?.is_admin === true
          const userId = userData?.id || 'default'
          
          if (isAdmin) {
            // For admin users, save ONLY to adminSettings
            const adminSettings = JSON.parse(localStorage.getItem('adminSettings') || '{}')
            adminSettings.profileImage = base64Image
            localStorage.setItem('adminSettings', JSON.stringify(adminSettings))
            
            // Remove any admin image from userSettings to prevent shared state
            const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}')
            if (userSettings.profileImage) {
              delete userSettings.profileImage
              localStorage.setItem('userSettings', JSON.stringify(userSettings))
            }
          } else {
            // For regular users, save to user-specific storage
            const settings = JSON.parse(localStorage.getItem('userSettings') || '{}')
            
            // Create/update user-specific profile images store
            if (!settings.userProfileImages) {
              settings.userProfileImages = {}
            }
            
            // Save image under user's ID
            settings.userProfileImages[userId] = base64Image
            
            // Also update the current profileImage for this session
            settings.profileImage = base64Image
            
            localStorage.setItem('userSettings', JSON.stringify(settings))
          }
        } catch (e) {
          console.error('Error saving profile image to localStorage:', e)
        }
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleRemoveProfilePicture = () => {
    setUserSettings(prev => ({ ...prev, profileImage: '' }))
    
    // Remove profile picture from the appropriate storage
    try {
      // Check if user is admin
      const currentUserStr = localStorage.getItem('current-user')
      const userData = currentUserStr ? JSON.parse(currentUserStr) : null
      const isAdmin = userData?.is_admin === true
      const userId = userData?.id || 'default'
      
      if (isAdmin) {
        // Remove from adminSettings
        const adminSettings = JSON.parse(localStorage.getItem('adminSettings') || '{}')
        if (adminSettings.profileImage) {
          delete adminSettings.profileImage
          localStorage.setItem('adminSettings', JSON.stringify(adminSettings))
        }
      } else {
        // Remove from userSettings for this specific user
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}')
        
        // Remove from user-specific store if it exists
        if (settings.userProfileImages && settings.userProfileImages[userId]) {
          delete settings.userProfileImages[userId]
        }
        
        // Also clear current profileImage
        if (settings.profileImage) {
          delete settings.profileImage
        }
        
        localStorage.setItem('userSettings', JSON.stringify(settings))
      }
    } catch (e) {
      console.error('Error removing profile image from localStorage:', e)
    }
    
    toast({
      title: "Profile picture removed",
      description: "Your profile picture has been successfully removed.",
      duration: 3000,
    })
  }
  
  const handleSaveChanges = (section: string) => {
    setIsSaving(true)
    
    // Save settings to localStorage
    try {
      // Check if the user is an admin and save to appropriate storage
      const isAdmin = (() => {
        try {
          const currentUserStr = localStorage.getItem('current-user')
          if (currentUserStr) {
            const userData = JSON.parse(currentUserStr)
            return userData && userData.is_admin === true
          }
          return false
        } catch (e) {
          console.error('Error checking admin status:', e)
          return false
        }
      })()
      
      // Get current user ID
      const currentUserStr = localStorage.getItem('current-user');
      const userData = currentUserStr ? JSON.parse(currentUserStr) : null;
      const userId = userData?.id || 'default';
      
      if (isAdmin) {
        // Get existing admin settings or create new ones
        const existingAdminSettings = localStorage.getItem('adminSettings')
        const adminSettings = existingAdminSettings 
          ? JSON.parse(existingAdminSettings)
          : {}
          
        // Update admin profile image specifically
        adminSettings.profileImage = userSettings.profileImage
        localStorage.setItem('adminSettings', JSON.stringify(adminSettings))
        
        // Create a copy of userSettings without the profile image to save in userSettings
        const { profileImage, ...userSettingsWithoutImage } = userSettings;
        localStorage.setItem('userSettings', JSON.stringify(userSettingsWithoutImage));
      } else {
        // For non-admin users, save to user-specific profile image store
        const existingUserSettings = localStorage.getItem('userSettings');
        const settings = existingUserSettings 
          ? JSON.parse(existingUserSettings)
          : {};
        
        // Ensure userProfileImages object exists
        if (!settings.userProfileImages) {
          settings.userProfileImages = {};
        }
        
        // Save user-specific profile image
        if (userSettings.profileImage) {
          settings.userProfileImages[userId] = userSettings.profileImage;
        } else if (settings.userProfileImages && settings.userProfileImages[userId]) {
          // Remove profile image if it was cleared
          delete settings.userProfileImages[userId];
        }
        
        // Include all other settings
        const updatedSettings = {
          ...userSettings,
          userProfileImages: settings.userProfileImages
        };
        
        localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      }
      
      // Also update current-user with relevant profile information
      try {
        const currentUserStr = localStorage.getItem('current-user')
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr)
          // Update profile-related fields in current-user
          const updatedUser = {
            ...currentUser,
            full_name: userSettings.fullName,
            department: userSettings.department,
            // Keep other authentication-related data unchanged
          }
          localStorage.setItem('current-user', JSON.stringify(updatedUser))
        }
      } catch (e) {
        console.error('Error updating current user in localStorage:', e)
      }
      
      // Simulate API call delay for better UX
      setTimeout(() => {
        setIsSaving(false)
        toast({
          title: "Changes saved",
          description: section === 'all' 
            ? "All your settings have been updated successfully."
            : `Your ${section} settings have been updated successfully.`,
          duration: 3000,
        })
      }, 1000)
    } catch (error) {
      console.error('Failed to save settings:', error)
      setIsSaving(false)
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings.title', 'Settings')}</h1>
        <Button variant="outline" onClick={() => handleSaveChanges('all')}>
          {isSaving ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            <span className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Save All Changes
            </span>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="profile" className="mt-8">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            {t('settings.tabs.profile', 'Profile')}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Palette className="mr-2 h-4 w-4" />
            {t('settings.tabs.appearance', 'Appearance')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            {t('settings.tabs.notifications', 'Notifications')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6 mt-4">
          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-800">
              <CardTitle className="text-xl">{t('settings.profileSettings', 'Profile Settings')}</CardTitle>
              <CardDescription>
                {t('settings.profileDesc', 'Manage your account information and preferences')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-start">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div 
                    className="relative cursor-pointer group"
                    onClick={handleProfilePictureClick}
                  >
                    <Avatar className="h-32 w-32 border-2 border-white dark:border-slate-800 shadow-md">
                      <AvatarImage src={userSettings.profileImage} />
                      <AvatarFallback className="bg-blue-100 text-blue-800 flex items-center justify-center">
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  <div className="flex space-x-2 w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={handleProfilePictureClick}
                    >
                      <Upload className="mr-1 h-4 w-4" />
                      Upload
                    </Button>
                    
                    {userSettings.profileImage && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleRemoveProfilePicture}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        value={userSettings.fullName} 
                        onChange={(e) => setUserSettings({...userSettings, fullName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('settings.email', 'Email')}</Label>
                      <Input id="email" value={userSettings.email} readOnly />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input 
                        id="department" 
                        value={userSettings.department} 
                        onChange={(e) => setUserSettings({...userSettings, department: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input 
                        id="designation" 
                        value={userSettings.designation} 
                        onChange={(e) => setUserSettings({...userSettings, designation: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">{t('settings.language', 'Language')}</Label>
                    <Select value={userSettings.language} onValueChange={handleLanguageChange}>
                      <SelectTrigger id="language" className="w-full md:w-[250px]">
                        <SelectValue placeholder={t('settings.selectLanguage', 'Select language')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="mr">Marathi</SelectItem>
                        <SelectItem value="te">Telugu</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      This will change the language across the entire platform
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-slate-50 dark:bg-slate-800 px-6 py-4 flex justify-end">
              <Button onClick={() => handleSaveChanges('profile')}>
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span>{t('settings.saveProfile', 'Save Changes')}</span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-800">
              <CardTitle className="text-xl">{t('settings.appearanceSettings', 'Appearance')}</CardTitle>
              <CardDescription>
                {t('settings.appearanceDesc', 'Customize the look and feel of the application')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div>
                  <h3 className="text-lg font-medium">{t('settings.theme', 'Theme')}</h3>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
                </div>
                                              <ThemeToggle onThemeChange={(theme) => {
                                setUserSettings(prev => ({
                                  ...prev,
                                  theme
                                }))
                              }} />
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div>
                  <h3 className="text-lg font-medium">Text Size</h3>
                  <p className="text-sm text-muted-foreground">Adjust the size of text throughout the application</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">A-</Button>
                  <Button size="sm" variant="outline">A</Button>
                  <Button size="sm" variant="outline">A+</Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div>
                  <h3 className="text-lg font-medium">Animation</h3>
                  <p className="text-sm text-muted-foreground">Enable or disable animations in the interface</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div>
                  <h3 className="text-lg font-medium">High Contrast</h3>
                  <p className="text-sm text-muted-foreground">Increase contrast for better readability</p>
                </div>
                <Switch />
              </div>
            </CardContent>
            
            <CardFooter className="bg-slate-50 dark:bg-slate-800 px-6 py-4 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  // Reset appearance settings to default
                  setUserSettings(prev => ({
                    ...prev,
                    theme: 'light'
                  }))
                  toast({
                    title: "Reset successful",
                    description: "Appearance settings have been reset to default.",
                    duration: 3000,
                  })
                }}
              >
                {t('settings.resetToDefault', 'Reset to Default')}
              </Button>
              
              <Button onClick={() => handleSaveChanges('appearance')}>
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span>{t('settings.saveAppearance', 'Save Changes')}</span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-800">
              <CardTitle className="text-xl">{t('settings.notificationSettings', 'Notification Settings')}</CardTitle>
              <CardDescription>
                {t('settings.notificationDesc', 'Configure how and when you receive notifications')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div>
                  <h3 className="text-lg font-medium">{t('settings.enableNotifications', 'Enable All Notifications')}</h3>
                  <p className="text-sm text-muted-foreground">Master control for all notification types</p>
                </div>
                <Switch
                  id="notifications"
                  checked={userSettings.notificationsEnabled}
                  onCheckedChange={handleNotificationChange}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                
                <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    disabled={!userSettings.notificationsEnabled}
                    checked={userSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setUserSettings(prev => ({...prev, emailNotifications: checked}))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div>
                    <h4 className="font-medium">In-App Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications within the application</p>
                  </div>
                  <Switch 
                    disabled={!userSettings.notificationsEnabled}
                    checked={userSettings.inAppNotifications}
                    onCheckedChange={(checked) => 
                      setUserSettings(prev => ({...prev, inAppNotifications: checked}))
                    }
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                
                <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div>
                    <h4 className="font-medium">DPR Updates</h4>
                    <p className="text-sm text-muted-foreground">Get notified when DPR status changes</p>
                  </div>
                  <Switch 
                    disabled={!userSettings.notificationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div>
                    <h4 className="font-medium">Risk Analysis</h4>
                    <p className="text-sm text-muted-foreground">Receive alerts for risk analysis reports</p>
                  </div>
                  <Switch 
                    disabled={!userSettings.notificationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div>
                    <h4 className="font-medium">System Updates</h4>
                    <p className="text-sm text-muted-foreground">Be informed about system maintenance and updates</p>
                  </div>
                  <Switch 
                    disabled={!userSettings.notificationsEnabled}
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-slate-50 dark:bg-slate-800 px-6 py-4 flex justify-end">
              <Button onClick={() => handleSaveChanges('notifications')}>
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span>{t('settings.saveNotifications', 'Save Preferences')}</span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}