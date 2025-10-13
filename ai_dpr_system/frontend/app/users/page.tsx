'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UserActions } from './components/user-actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Define TypeScript interfaces
export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'Active' | 'Inactive';
}

interface NewUserForm {
  name: string;
  email: string;
  department: string;
  role: string;
}

// Initialize with empty array, will load from localStorage
const mockUsers: User[] = [];

export default function UsersPage() {
  // Load users from localStorage or use mockUsers as fallback
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
        status: 'Active'
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
        const mergedUsers = [...mockUsers, ...convertedUsers];
        localStorage.setItem('users-list', JSON.stringify(mergedUsers));
        return mergedUsers;
      }
      
      // If nothing, save mockUsers to localStorage
      localStorage.setItem('users-list', JSON.stringify(mockUsers));
    }
    return mockUsers;
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
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const { toast } = useToast();

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission to add new user
  const handleAddUser = () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.department || !newUser.role) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }
    
    // Check for duplicate email
    if (users.some(user => user.email.toLowerCase() === newUser.email.toLowerCase())) {
      toast({
        title: "Error",
        description: "This email is already registered",
        variant: "destructive"
      });
      return;
    }
    
    // Add new user
    const id = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
    const updatedUser = { 
      ...newUser, 
      id, 
      status: 'Active' as 'Active' 
    };
    const updatedUsers: User[] = [...users, updatedUser];
    
    // Update state
    setUsers(updatedUsers);
    setIsAddUserOpen(false);
    
    // Save to localStorage
    localStorage.setItem('users-list', JSON.stringify(updatedUsers));
    
    // Also update registered users if appropriate
    const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');
    registeredUsers.push({
      id: id.toString(),
      email: newUser.email,
      full_name: newUser.name,
      department: newUser.department,
      is_admin: newUser.role === 'Admin',
      is_reviewer: newUser.role === 'Reviewer',
      created_at: new Date().toISOString()
    });
    localStorage.setItem('registered-users', JSON.stringify(registeredUsers));
    
    // Reset form
    setNewUser({
      name: '',
      email: '',
      department: '',
      role: '',
    });
    
    toast({
      title: "Success",
      description: "User added successfully",
    });
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditUserOpen(true);
  };

  // Handle save edited user
  const handleSaveEditedUser = () => {
    if (!editingUser) return;
    
    // Validate form
    if (!editingUser.name || !editingUser.email || !editingUser.department || !editingUser.role) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }
    
    // Check for duplicate email (except for the current user)
    if (users.some(user => 
      user.email.toLowerCase() === editingUser.email.toLowerCase() && 
      user.id !== editingUser.id
    )) {
      toast({
        title: "Error",
        description: "This email is already registered by another user",
        variant: "destructive"
      });
      return;
    }
    
    // Update user
    const updatedUsers = users.map(user => 
      user.id === editingUser.id ? editingUser : user
    );
    
    // Update state
    setUsers(updatedUsers);
    setIsEditUserOpen(false);
    setEditingUser(null);
    
    // Update localStorage
    localStorage.setItem('users-list', JSON.stringify(updatedUsers));
    
    // Also update registered users if appropriate
    const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');
    const updatedRegisteredUsers = registeredUsers.map((user: any) => {
      if (user.email.toLowerCase() === editingUser.email.toLowerCase()) {
        return {
          ...user,
          full_name: editingUser.name,
          department: editingUser.department,
          is_admin: editingUser.role === 'Admin',
          is_reviewer: editingUser.role === 'Reviewer'
        };
      }
      return user;
    });
    localStorage.setItem('registered-users', JSON.stringify(updatedRegisteredUsers));
    
    toast({
      title: "Success",
      description: "User updated successfully",
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setUserToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = () => {
    if (userToDelete === null) return;
    
    const userToDeleteObj = users.find(user => user.id === userToDelete);
    if (!userToDeleteObj) return;
    
    const updatedUsers = users.filter(user => user.id !== userToDelete);
    setUsers(updatedUsers);
    
    // Update localStorage
    localStorage.setItem('users-list', JSON.stringify(updatedUsers));
    
    // Also update registered users if appropriate
    const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');
    const updatedRegisteredUsers = registeredUsers.filter(
      (u: any) => u.email.toLowerCase() !== userToDeleteObj.email.toLowerCase()
    );
    localStorage.setItem('registered-users', JSON.stringify(updatedRegisteredUsers));
    
    setIsDeleteConfirmOpen(false);
    setUserToDelete(null);
    
    toast({
      title: "Success",
      description: "User deleted successfully",
    });
  };

  // Toggle user status between active and inactive
  const handleToggleStatus = (id: number, newStatus: 'Active' | 'Inactive') => {
    const updatedUsers: User[] = users.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    
    // Update localStorage
    localStorage.setItem('users-list', JSON.stringify(updatedUsers));
    
    // Update registered users if appropriate
    const targetUser = users.find(user => user.id === id);
    if (!targetUser) return;
    
    const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');
    const userIndex = registeredUsers.findIndex(
      (u: any) => u.email.toLowerCase() === targetUser.email.toLowerCase()
    );
    if (userIndex !== -1) {
      registeredUsers[userIndex].is_active = newStatus === 'Active';
      localStorage.setItem('registered-users', JSON.stringify(registeredUsers));
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Button onClick={() => setIsAddUserOpen(!isAddUserOpen)}>
            {isAddUserOpen ? 'Cancel' : 'Add User'}
          </Button>
        </CardHeader>
        <CardContent>
          {isAddUserOpen && (
            <Card className="mb-6 border-dashed border-2 border-gray-300">
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 py-2">
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                    <Label htmlFor="name" className="md:text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setNewUser({...newUser, name: e.target.value})
                      }
                      className="md:col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                    <Label htmlFor="email" className="md:text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setNewUser({...newUser, email: e.target.value})
                      }
                      className="md:col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                    <Label htmlFor="department" className="md:text-right">
                      Department
                    </Label>
                    <div className="md:col-span-3">
                      <Select
                        value={newUser.department}
                        onValueChange={(value) => setNewUser({...newUser, department: value})}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Planning">Planning</SelectItem>
                          <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                    <Label htmlFor="role" className="md:text-right">
                      Role
                    </Label>
                    <div className="md:col-span-3">
                      <Select
                        value={newUser.role}
                        onValueChange={(value) => setNewUser({...newUser, role: value})}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Administrator</SelectItem>
                          <SelectItem value="Reviewer">Reviewer</SelectItem>
                          <SelectItem value="Standard User">Standard User</SelectItem>
                          <SelectItem value="Read-Only">Read-Only User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddUser}>Add User</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="mb-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          user.status === 'Active' 
                            ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
                            : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <UserActions 
                          user={user} 
                          onEdit={handleEditUser}
                          onDelete={handleDeleteConfirm}
                          onUpdateStatus={handleToggleStatus}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editingUser?.name || ''}
                onChange={(e) => setEditingUser(editingUser ? {...editingUser, name: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                value={editingUser?.email || ''}
                onChange={(e) => setEditingUser(editingUser ? {...editingUser, email: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-department" className="text-right">
                Department
              </Label>
              <div className="col-span-3">
                <Select
                  value={editingUser?.department || ''}
                  onValueChange={(value) => setEditingUser(editingUser ? {...editingUser, department: value} : null)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>
              <div className="col-span-3">
                <Select
                  value={editingUser?.role || ''}
                  onValueChange={(value) => setEditingUser(editingUser ? {...editingUser, role: value} : null)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Administrator</SelectItem>
                    <SelectItem value="Reviewer">Reviewer</SelectItem>
                    <SelectItem value="Standard User">Standard User</SelectItem>
                    <SelectItem value="Read-Only">Read-Only User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEditedUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}