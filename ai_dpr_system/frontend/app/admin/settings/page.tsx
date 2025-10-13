"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { 
  User, 
  Shield, 
  Bell, 
  PaintBucket, 
  Moon, 
  Sun, 
  Monitor, 
  Trash2, 
  Upload, 
  Save,
  AlertTriangle,
  Mail,
  Key,
  LockKeyhole,
  Clock,
  Globe,
  BellRing,
  BellOff
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AdminIcons } from "@/components/admin-icons";

export default function AdminSettingsPage() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Administrator");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saveButtonStatus, setSaveButtonStatus] = useState<"idle" | "saving" | "saved">("idle");

  // Load admin data from localStorage on component mount
  useEffect(() => {
    const adminData = localStorage.getItem("adminData");
    if (adminData) {
      try {
        const parsedData = JSON.parse(adminData);
        setName(parsedData.name || "");
        setEmail(parsedData.email || "");
        setRole(parsedData.role || "Administrator");
        
        // Check for admin-specific avatar
        const adminAvatar = localStorage.getItem("adminAvatar");
        if (adminAvatar) {
          setAvatarUrl(adminAvatar);
          setPreviewUrl(adminAvatar);
        }
      } catch (e) {
        console.error("Error parsing admin data:", e);
      }
    } else {
      // Try to get data from current-user if adminData doesn't exist
      const currentUser = localStorage.getItem("current-user");
      if (currentUser) {
        try {
          const userData = JSON.parse(currentUser);
          setName(userData.full_name || "");
          setEmail(userData.email || "");
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL for the selected image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const result = fileReader.result as string;
        setPreviewUrl(result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = () => {
    setSaveButtonStatus("saving");
    
    // Simulate network delay
    setTimeout(() => {
      // Save admin data
      const adminData = {
        name,
        email,
        role
      };
      localStorage.setItem("adminData", JSON.stringify(adminData));

      // Save admin avatar separately from user avatar
      if (previewUrl) {
        localStorage.setItem("adminAvatar", previewUrl);
      }

      toast({
        title: "Profile Updated",
        description: "Your admin profile has been updated successfully.",
      });
      
      setSaveButtonStatus("saved");
      
      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveButtonStatus("idle");
      }, 2000);
    }, 800);
  };

  const handleRemoveProfilePicture = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    localStorage.removeItem("adminAvatar");
    
    toast({
      title: "Profile Picture Removed",
      description: "Your admin profile picture has been removed.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('Settings')}</h2>
          <p className="text-muted-foreground">{t('Manage your admin profile and system preferences.')}</p>
        </div>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-4 bg-background border">
          <TabsTrigger value="account" className="data-[state=active]:bg-primary/10">
            <User className="h-4 w-4 mr-2" />
            {t('Account')}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-primary/10">
            <PaintBucket className="h-4 w-4 mr-2" />
            {t('Appearance')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/10">
            <Bell className="h-4 w-4 mr-2" />
            {t('Notifications')}
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary/10">
            <Shield className="h-4 w-4 mr-2" />
            {t('Security')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <div className="grid gap-6">
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center">
                  <AdminIcons.Users className="mr-2 h-5 w-5 text-primary" />
                  {t('Admin Profile')}
                </CardTitle>
                <CardDescription>
                  {t('Update your administrator profile information')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center space-y-3">
                      <Avatar className="h-28 w-28 border-4 border-background shadow-md">
                        <AvatarImage src={previewUrl || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                          {name ? name.substring(0, 2).toUpperCase() : "AD"}
                        </AvatarFallback>
                      </Avatar>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {role || "Administrator"}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center"
                          onClick={() => document.getElementById('profile-picture')?.click()}
                        >
                          <Upload className="h-3.5 w-3.5 mr-1.5" />
                          {t('Upload')}
                        </Button>
                        {previewUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center text-destructive hover:text-destructive"
                            onClick={handleRemoveProfilePicture}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                            {t('Remove')}
                          </Button>
                        )}
                      </div>
                      <Input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">
                            {t('Full Name')}
                          </Label>
                          <Input
                            id="name"
                            placeholder={t('Enter your full name')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">
                            {t('Email Address')}
                          </Label>
                          <Input
                            id="email"
                            placeholder={t('Enter your email')}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role" className="text-sm font-medium">
                            {t('Role')}
                          </Label>
                          <Select value={role} onValueChange={setRole}>
                            <SelectTrigger id="role">
                              <SelectValue placeholder={t('Select role')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Administrator">{t('Administrator')}</SelectItem>
                              <SelectItem value="Super Admin">{t('Super Admin')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone" className="text-sm font-medium">
                            {t('Timezone')}
                          </Label>
                          <Select defaultValue="UTC+05:30">
                            <SelectTrigger id="timezone">
                              <SelectValue placeholder={t('Select timezone')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UTC+05:30">UTC+05:30 (IST)</SelectItem>
                              <SelectItem value="UTC+00:00">UTC+00:00 (GMT)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 bg-muted/30 flex justify-between">
                <p className="text-sm text-muted-foreground">
                  {t('Last updated')}: {new Date().toLocaleDateString()}
                </p>
                <Button onClick={handleUpdateProfile} disabled={saveButtonStatus !== "idle"} className="flex items-center">
                  {saveButtonStatus === "saving" && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>}
                  {saveButtonStatus === "saved" && <Save className="mr-2 h-4 w-4" />}
                  {saveButtonStatus === "idle" && <Save className="mr-2 h-4 w-4" />}
                  {saveButtonStatus === "saving" ? t('Saving...') : saveButtonStatus === "saved" ? t('Saved!') : t('Save Changes')}
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center">
                  <AdminIcons.Settings className="mr-2 h-5 w-5 text-primary" />
                  {t('System Preferences')}
                </CardTitle>
                <CardDescription>
                  {t('Customize your admin dashboard experience')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">{t('Dashboard Layout')}</h3>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">{t('Compact View')}</Label>
                          <p className="text-xs text-muted-foreground">{t('Display more content with compact cards')}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">{t('Show Analytics')}</Label>
                          <p className="text-xs text-muted-foreground">{t('Display analytics charts on dashboard')}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium">{t('Regional Settings')}</h3>
                      <div className="space-y-2">
                        <Label htmlFor="language" className="text-sm">
                          {t('Language')}
                        </Label>
                        <Select defaultValue="en">
                          <SelectTrigger id="language" className="flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder={t('Select language')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">{t('English')}</SelectItem>
                            <SelectItem value="hi">{t('Hindi')}</SelectItem>
                            <SelectItem value="bn">{t('Bengali')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateFormat" className="text-sm">
                          {t('Date Format')}
                        </Label>
                        <Select defaultValue="dd/mm/yyyy">
                          <SelectTrigger id="dateFormat">
                            <SelectValue placeholder={t('Select date format')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                            <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                            <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 bg-muted/30 flex justify-end">
                <Button variant="outline" className="mr-2">
                  {t('Reset to Defaults')}
                </Button>
                <Button>
                  {t('Save Preferences')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center">
                <AdminIcons.Analytics className="mr-2 h-5 w-5 text-primary" />
                {t('Appearance Settings')}
              </CardTitle>
              <CardDescription>
                {t('Customize how the admin dashboard looks')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-4">{t('Theme')}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="flex flex-col items-center justify-center h-24 border-primary/50">
                      <Monitor className="h-8 w-8 mb-2 text-primary" />
                      <span>{t('System')}</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col items-center justify-center h-24">
                      <Sun className="h-8 w-8 mb-2 text-amber-500" />
                      <span>{t('Light')}</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col items-center justify-center h-24">
                      <Moon className="h-8 w-8 mb-2 text-indigo-500" />
                      <span>{t('Dark')}</span>
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">{t('Menu Options')}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">{t('Compact Sidebar')}</Label>
                        <p className="text-xs text-muted-foreground">{t('Display icons only in sidebar')}</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">{t('Sticky Header')}</Label>
                        <p className="text-xs text-muted-foreground">{t('Keep header visible when scrolling')}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">{t('Accessibility')}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">{t('High Contrast')}</Label>
                        <p className="text-xs text-muted-foreground">{t('Increase contrast for better visibility')}</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">{t('Reduce Motion')}</Label>
                        <p className="text-xs text-muted-foreground">{t('Minimize animations throughout the interface')}</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/30 flex justify-end">
              <Button variant="outline" className="mr-2">
                {t('Reset to Defaults')}
              </Button>
              <Button>
                {t('Save Appearance')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center">
                <BellRing className="mr-2 h-5 w-5 text-primary" />
                {t('Notification Settings')}
              </CardTitle>
              <CardDescription>
                {t('Configure how you receive system notifications')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">{t('Email Notifications')}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">{t('New User Registrations')}</Label>
                      <p className="text-xs text-muted-foreground">{t('Receive email when new users register')}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">{t('High Risk DPR Alerts')}</Label>
                      <p className="text-xs text-muted-foreground">{t('Get notified about high risk DPRs')}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">{t('System Reports')}</Label>
                      <p className="text-xs text-muted-foreground">{t('Weekly system performance reports')}</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">{t('In-App Notifications')}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">{t('DPR Uploads')}</Label>
                      <p className="text-xs text-muted-foreground">{t('Show notifications for new DPR uploads')}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">{t('User Activity')}</Label>
                      <p className="text-xs text-muted-foreground">{t('Notify about important user actions')}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/30 flex justify-end">
              <Button variant="outline" className="mr-2">
                <BellOff className="h-4 w-4 mr-2" />
                {t('Disable All')}
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                {t('Save Settings')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center">
                <LockKeyhole className="mr-2 h-5 w-5 text-primary" />
                {t('Security Settings')}
              </CardTitle>
              <CardDescription>
                {t('Manage your admin account security')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">{t('Password Management')}</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="current-password">{t('Current Password')}</Label>
                      <Input id="current-password" type="password" placeholder="••••••••" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">{t('New Password')}</Label>
                      <Input id="new-password" type="password" placeholder="••••••••" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">{t('Confirm New Password')}</Label>
                      <Input id="confirm-password" type="password" placeholder="••••••••" />
                    </div>
                    
                    <Button>
                      <Key className="h-4 w-4 mr-2" />
                      {t('Update Password')}
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">{t('Security Options')}</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">{t('Two-Factor Authentication')}</Label>
                        <p className="text-xs text-muted-foreground">{t('Add an extra layer of security')}</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">{t('Login Notifications')}</Label>
                        <p className="text-xs text-muted-foreground">{t('Get alerted about new sign-ins')}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">{t('API Access')}</Label>
                        <p className="text-xs text-muted-foreground">{t('Allow API access to your account')}</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="destructive" className="w-full">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {t('Reset Security Settings')}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">{t('Session Information')}</h4>
                      <p className="text-xs text-amber-800/70 dark:text-amber-300/70 mt-1">
                        {t('Last login')}: {new Date().toLocaleString()} <br />
                        {t('IP Address')}: 127.0.0.1 <br />
                        {t('Location')}: New Delhi, India <br />
                        {t('Device')}: Windows / Chrome
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/30 flex justify-between">
              <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                {t('Logout All Devices')}
              </Button>
              <Button>
                {t('Save Security Settings')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}