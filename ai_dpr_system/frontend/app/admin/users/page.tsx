'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Search, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-provider';
import { useTranslation } from 'react-i18next';

// Define TypeScript interfaces
interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'Active' | 'Inactive';
  is_admin?: boolean;
  is_reviewer?: boolean;
  full_name?: string;
  password?: string;
}

interface NewUserForm {
  name: string;
  email: string;
  department: string;
  role: string;
  password: string;
}

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Load users from localStorage
  const loadInitialUsers = () => {
    if (typeof window !== 'undefined') {
      // First check registered users and convert them to user format
      const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');
      const convertedUsers: User[] = registeredUsers.map((user: any, index: number) => ({
        id: parseInt(user.id) || index + 1000, // Use the ID from registered user or generate one
        name: user.full_name || '',
        email: user.email || '',
        department: user.department || '',
        role: user.is_admin ? 'Admin' : user.is_reviewer ? 'Reviewer' : 'Standard User',
        status: 'Active',
        is_admin: user.is_admin,
        is_reviewer: user.is_reviewer,
        password: user.password // Include the password
      }));
      
      // Then check existing users list
      const savedUsers = localStorage.getItem('users-list');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        
        // Merge the lists, preventing duplicates by email
        const existingEmails = new Set(parsedUsers.map((u: User) => u.email.toLowerCase()));
        const uniqueConvertedUsers = convertedUsers.filter(u => !existingEmails.has(u.email.toLowerCase()));
        
        const mergedUsers = [...parsedUsers, ...uniqueConvertedUsers];
        
        // Update the localStorage with merged list
        localStorage.setItem('users-list', JSON.stringify(mergedUsers));
        return mergedUsers;
      }
      
      // If no saved users in users-list, but we have registered users
      if (convertedUsers.length > 0) {
        localStorage.setItem('users-list', JSON.stringify(convertedUsers));
        return convertedUsers;
      }
      
      // If nothing, return an empty array
      return [];
    }
    return [];
  };

  const [users, setUsers] = useState<User[]>(loadInitialUsers());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddUserOpen, setIsAddUserOpen] = useState<boolean>(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<NewUserForm>({
    name: '',
    email: '',
    department: '',
    role: '',
    password: '',
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // Helper function to get password for a user
  const getPasswordForUser = (email: string): string => {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');
      const user = registeredUsers.find((u: any) => u.email === email);
      if (user && user.password) {
        return user.password;
      }
      return '••••••••'; // Default placeholder if password not found
    } catch (error) {
      console.error('Error getting user password:', error);
      return '••••••••';
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.department || !newUser.role || !newUser.password) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    // Create a user object
    const userToAdd = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: newUser.name,
      email: newUser.email,
      department: newUser.department,
      role: newUser.role,
      status: 'Active' as const,
      is_admin: newUser.role === 'Admin',
      is_reviewer: newUser.role === 'Reviewer'
    };

    // Add to users array
    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    
    // Save to localStorage
    localStorage.setItem('users-list', JSON.stringify(updatedUsers));
    
    // Add to registered users if needed
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');
      
      // Only add if the user doesn't already exist in registered users
      const userExists = registeredUsers.some((u: any) => u.email === userToAdd.email);
      
      if (!userExists) {
        registeredUsers.push({
          id: userToAdd.id.toString(),
          full_name: userToAdd.name,
          email: userToAdd.email,
          department: userToAdd.department,
          is_admin: userToAdd.is_admin,
          is_reviewer: userToAdd.is_reviewer,
          password: newUser.password // Use provided password
        });
        
        localStorage.setItem('registered-users', JSON.stringify(registeredUsers));
      }
    } catch (e) {
      console.error('Error updating registered users:', e);
    }

    // Reset form and close dialog
    setNewUser({
      name: '',
      email: '',
      department: '',
      role: '',
      password: '',
    });
    setIsAddUserOpen(false);
    
    toast({
      title: "Success",
      description: "User added successfully.",
    });
  };

  // Handle editing a user
  const handleEditUser = () => {
    if (!editingUser || !editingUser.name || !editingUser.email || !editingUser.department || !editingUser.role) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    // Update users array
    const updatedUsers = users.map(u => 
      u.id === editingUser.id ? {
        ...editingUser,
        is_admin: editingUser.role === 'Admin',
        is_reviewer: editingUser.role === 'Reviewer'
      } : u
    );
    setUsers(updatedUsers);
    
    // Save to localStorage
    localStorage.setItem('users-list', JSON.stringify(updatedUsers));
    
    // Update in registered users if exists
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');
      const updatedRegistered = registeredUsers.map((u: any) => {
        if (u.email === editingUser.email) {
          const updatedUser = {
            ...u,
            full_name: editingUser.name,
            department: editingUser.department,
            is_admin: editingUser.role === 'Admin',
            is_reviewer: editingUser.role === 'Reviewer'
          };
          
          // Update password only if provided
          if (editingUser.password) {
            updatedUser.password = editingUser.password;
          }
          
          return updatedUser;
        }
        return u;
      });
      
      localStorage.setItem('registered-users', JSON.stringify(updatedRegistered));
    } catch (e) {
      console.error('Error updating registered users:', e);
    }

    // Close dialog
    setIsEditUserOpen(false);
    setEditingUser(null);
    
    toast({
      title: "Success",
      description: "User updated successfully.",
    });
  };

  // Handle deleting a user
  const handleDeleteUser = () => {
    if (userToDelete === null) return;

    // Get user email before deleting
    const userEmail = users.find(u => u.id === userToDelete)?.email;
    
    // Update users array
    const updatedUsers = users.filter(u => u.id !== userToDelete);
    setUsers(updatedUsers);
    
    // Save to localStorage
    localStorage.setItem('users-list', JSON.stringify(updatedUsers));
    
    // Remove from registered users if exists
    if (userEmail) {
      try {
        const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');
        const updatedRegistered = registeredUsers.filter((u: any) => u.email !== userEmail);
        
        localStorage.setItem('registered-users', JSON.stringify(updatedRegistered));
      } catch (e) {
        console.error('Error updating registered users:', e);
      }
    }

    // Close dialog
    setIsDeleteConfirmOpen(false);
    setUserToDelete(null);
    
    toast({
      title: "Success",
      description: "User deleted successfully.",
    });
  };

  // Handle toggling user status
  const toggleUserStatus = (id: number) => {
    const updatedUsers: User[] = users.map((u): User =>
      u.id === id
        ? { ...u, status: u.status === 'Active' ? ('Inactive' as const) : ('Active' as const) }
        : u
    );
    setUsers(updatedUsers);
    
    // Save to localStorage
    localStorage.setItem('users-list', JSON.stringify(updatedUsers));
    
    toast({
      title: "Success",
      description: "User status updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('User Management')}</h2>
        <Button onClick={() => setIsAddUserOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('Add User')}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('All Users')}</span>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder={t('Search users...')}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Name')}</TableHead>
                <TableHead>{t('Email')}</TableHead>
                <TableHead>{t('Department')}</TableHead>
                <TableHead>{t('Role')}</TableHead>
                <TableHead>{t('Password')}</TableHead>
                <TableHead>{t('Status')}</TableHead>
                <TableHead className="text-right">{t('Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    {searchTerm ? t('No users found matching your search.') : t('No users found.')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'Admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                        user.role === 'Reviewer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getPasswordForUser(user.email)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Get the user's password if available from registered users
                          const password = getPasswordForUser(user.email);
                          setEditingUser({...user, password: password !== '••••••••' ? password : ''});
                          setIsEditUserOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.status === 'Active' ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUserToDelete(user.id);
                          setIsDeleteConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Add New User')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t('Name')}
              </Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t('Email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                {t('Department')}
              </Label>
              <Input
                id="department"
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                {t('Role')}
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('Select a role')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">{t('Admin')}</SelectItem>
                  <SelectItem value="Reviewer">{t('Reviewer')}</SelectItem>
                  <SelectItem value="Standard User">{t('Standard User')}</SelectItem>
                  <SelectItem value="Read-Only">{t('Read-Only')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                {t('Password')}
              </Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button onClick={handleAddUser}>
              {t('Add User')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Edit User')}</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  {t('Name')}
                </Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  {t('Email')}
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="col-span-3"
                  disabled // Email should not be editable
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-department" className="text-right">
                  {t('Department')}
                </Label>
                <Input
                  id="edit-department"
                  value={editingUser.department}
                  onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  {t('Role')}
                </Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t('Select a role')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">{t('Admin')}</SelectItem>
                    <SelectItem value="Reviewer">{t('Reviewer')}</SelectItem>
                    <SelectItem value="Standard User">{t('Standard User')}</SelectItem>
                    <SelectItem value="Read-Only">{t('Read-Only')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-password" className="text-right">
                  {t('Password')}
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  placeholder={t('Enter new password')}
                  value={editingUser.password || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button onClick={handleEditUser}>
              {t('Save Changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Confirm Deletion')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{t('Are you sure you want to delete this user? This action cannot be undone.')}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              {t('Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}