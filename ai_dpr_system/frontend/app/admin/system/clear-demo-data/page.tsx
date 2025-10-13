'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Info, ArrowLeft, HomeIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ClearDemoDataPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);
  
  // Function to display all localStorage keys and values for debugging
  const showLocalStorageContent = () => {
    const content: Record<string, any> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          // Try to parse as JSON first
          const value = localStorage.getItem(key);
          if (value) {
            try {
              content[key] = JSON.parse(value);
            } catch {
              content[key] = value;
            }
          }
        } catch (e) {
          content[key] = "Error parsing value";
        }
      }
    }
    
    console.log('Current localStorage content:', content);
    toast({
      title: 'LocalStorage Contents',
      description: 'Check browser console for details',
    });
  };

  // Function to clear all demo data
  const clearDemoData = () => {
    setIsClearing(true);
    try {
      // Clear all demo data from localStorage
      localStorage.removeItem('uploaded-dprs');
      localStorage.removeItem('generated-reports');
      localStorage.removeItem('system-logs');
      localStorage.removeItem('user-activities');
      
      // Clear DPRs and high-risk DPRs
      localStorage.setItem('dprs', JSON.stringify([]));
      localStorage.setItem('high-risk-dprs', JSON.stringify([]));
      
      // Initialize empty arrays for key data stores
      localStorage.setItem('uploaded-dprs', JSON.stringify([]));
      localStorage.setItem('generated-reports', JSON.stringify([]));
      
      toast({
        title: "Demo Data Cleared",
        description: "All demo data has been removed from the system.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error clearing demo data:", error);
      toast({
        title: "Error",
        description: "Failed to clear demo data",
        variant: "destructive"
      });
    } finally {
      setIsClearing(false);
    }
  };

  // Function to clear registered users
  const clearRegisteredUsers = () => {
    try {
      localStorage.setItem('registered-users', JSON.stringify([]));
      toast({
        title: 'Success',
        description: 'Registered users cleared successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to clear registered users',
      });
    }
  };

  // Function to clear users list
  const clearUsersList = () => {
    try {
      localStorage.setItem('users-list', JSON.stringify([]));
      toast({
        title: 'Success',
        description: 'Users list cleared successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to clear users list',
      });
    }
  };

  // Function to reset auth data
  const resetAuth = () => {
    try {
      // Clear auth tokens
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('current-user');
      
      // Clear redirect flags
      sessionStorage.removeItem('admin-redirected');
      
      toast({
        title: 'Success',
        description: 'Auth data reset successfully. You will need to log in again.',
      });
      
      // Redirect to login page
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reset auth data',
      });
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">System Maintenance</h1>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>System Administration</AlertTitle>
        <AlertDescription>
          This page contains system maintenance tools. Use with caution as these actions cannot be undone.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Clear Demo Data</CardTitle>
            <CardDescription>
              Remove all demo/sample data from the system and start fresh.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This will permanently remove all demo data from the system. This includes:
            </p>
            <ul className="list-disc pl-5 mb-4 text-sm">
              <li>Sample DPR entries</li>
              <li>Demo reports</li>
              <li>Test system logs</li>
              <li>Mock user activities</li>
            </ul>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-500">
              This action cannot be undone.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="destructive" 
              onClick={clearDemoData}
              disabled={isClearing}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isClearing ? "Clearing..." : "Clear All Demo Data"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reset Authentication</CardTitle>
            <CardDescription>
              Clear authentication tokens and session data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Use this option if you're experiencing login issues or need to reset your session.
              You will be redirected to the login page afterward.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="secondary" 
              onClick={resetAuth}
              className="w-full"
            >
              Reset Auth Data
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <h2 className="text-xl font-bold mt-8 mb-4">Advanced Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Selective Data Clearing</CardTitle>
            <CardDescription>
              Clear specific types of data from the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              onClick={clearRegisteredUsers}
              className="w-full mb-2"
            >
              Clear Registered Users
            </Button>
            
            <Button 
              variant="outline" 
              onClick={clearUsersList}
              className="w-full mb-2"
            >
              Clear Users List
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Diagnostic Tools</CardTitle>
            <CardDescription>
              Tools for system troubleshooting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={showLocalStorageContent}
              className="w-full"
            >
              Inspect LocalStorage Data
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              * Results will be shown in browser console (F12 &gt; Console)
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8">
        <Separator className="my-4" />
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/dashboard')} className="flex items-center gap-2">
            <HomeIcon className="h-4 w-4" />
            Return to Admin Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}