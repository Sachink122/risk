import apiClient from './api-client';

// User authentication services
export const authService = {
  // Login user
  login: async (email: string, password: string) => {
    try {
      console.log('Login attempt with:', email);
      
      // Special case for admin demo account
      if (email === 'admin@example.gov.in' && password === 'password123') {
        console.log('Using admin credentials');
        
        // Create a token for the admin user
        const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmdvdi5pbiIsImlhdCI6MTY5NzEyMDQyMCwiZXhwIjoxNzI4NjU2NDIwfQ.admin_user_token";
        const adminRefreshToken = "refresh_token_admin";
        
        // Create admin user object
        const adminUser = {
          id: '1',
          email: 'admin@example.gov.in',
          full_name: 'Admin User',
          department: 'Administration',
          is_admin: true,
          is_reviewer: true
        };
        
        localStorage.setItem('auth-token', adminToken);
        localStorage.setItem('refresh-token', adminRefreshToken);
        localStorage.setItem('current-user', JSON.stringify(adminUser));
        
        // Clear any redirect flags from session storage
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.removeItem('admin-redirected');
        }
        
        // Return admin user data
        return {
          access_token: adminToken,
          refresh_token: adminRefreshToken,
          token_type: 'bearer',
          user: adminUser
        };
      }

      // Check for registered users in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');
      const user = registeredUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      
      if (user) {
        console.log('Found registered user:', user.email);
        
        // Validate password - in a real app this would use proper password hashing
        if (user.password === password) {
          console.log('Password matches for registered user');
          
          // Create a token for the registered user - Use a fixed token for simplicity
          const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZW1haWwiOiJyZWdpc3RlcmVkQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk3MTIwNDIwLCJleHAiOjE3Mjg2NTY0MjB9.registered_user_token";
          const userRefreshToken = "refresh_token_registered";
          
          // Ensure is_admin is properly set as a boolean
          const userWithBooleanFlags = {
            ...user,
            is_admin: user.is_admin === true,
            is_reviewer: user.is_reviewer === true
          };
          
          localStorage.setItem('auth-token', userToken);
          localStorage.setItem('refresh-token', userRefreshToken);
          localStorage.setItem('current-user', JSON.stringify(userWithBooleanFlags));
          
          // Return user data
          return {
            access_token: userToken,
            refresh_token: userRefreshToken,
            token_type: 'bearer',
            user: {
              id: user.id,
              email: user.email,
              full_name: user.full_name,
              department: user.department,
              is_admin: user.is_admin === true,
              is_reviewer: user.is_reviewer === true,
            }
          };
        } else {
          console.error('Password does not match for user:', email);
          throw new Error('Invalid email or password');
        }
      }
      
      // If not found in registered users, try API call
      try {
        const formData = new URLSearchParams();
        formData.append('username', email);  // Backend expects 'username' from form
        formData.append('password', password);
        
        const response = await apiClient.post('/api/v1/auth/login', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        
        console.log('Login response:', response);
        
        if (response.data.access_token) {
          localStorage.setItem('auth-token', response.data.access_token);
          localStorage.setItem('refresh-token', response.data.refresh_token);
        }
        
        // Mock user data since the token endpoint doesn't return user info
        const mockUser = {
          id: '1',
          email: email,
          full_name: 'Standard User',
          department: 'General',
          is_admin: false,
          is_reviewer: false,
        };
        
        return {
          ...response.data,
          user: mockUser
        };
      } catch (apiError) {
        console.error('API login failed:', apiError);
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  // Register new user
  register: async (userData: {
    email: string;
    password: string;
    full_name: string;
    department: string;
    is_admin?: boolean;
    is_reviewer?: boolean;
  }) => {
    try {
      console.log('Registration attempt with:', userData.email);
      
      // For development/testing - simulate registration without backend
      // Store the registered user in localStorage for persistence
      const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');
      
      // Check if email already exists
      const emailExists = registeredUsers.some((user: any) => user.email.toLowerCase() === userData.email.toLowerCase());
      if (emailExists) {
        throw {
          response: {
            data: {
              detail: 'Email already registered. Please use a different email address.'
            }
          }
        };
      }
      
      // Check if email exists in admin account
      if (userData.email.toLowerCase() === 'admin@example.gov.in') {
        throw {
          response: {
            data: {
              detail: 'This email is reserved for system administration. Please use a different email address.'
            }
          }
        };
      }
      
      // Create new user with generated ID and include password
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        password: userData.password, // Save password for local authentication
        full_name: userData.full_name,
        department: userData.department,
        is_admin: userData.is_admin || false,
        is_reviewer: userData.is_reviewer || false,
        created_at: new Date().toISOString()
      };
      
      // Add to registered users
      registeredUsers.push(newUser);
      localStorage.setItem('registered-users', JSON.stringify(registeredUsers));
      
      console.log('Registration successful:', newUser);
      
      // Also update the users list in localStorage for the users page
      const usersListData = JSON.parse(localStorage.getItem('users-list') || '[]');
      usersListData.push({
        id: parseInt(newUser.id),
        name: newUser.full_name,
        email: newUser.email,
        department: newUser.department,
        role: newUser.is_admin ? 'Admin' : (newUser.is_reviewer ? 'Reviewer' : 'Standard User'),
        status: 'Active'
      });
      localStorage.setItem('users-list', JSON.stringify(usersListData));
      
      return {
        data: { 
          message: 'Registration successful',
          user: newUser
        }
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('refresh-token');
    // Skip calling backend if it's causing issues
    // Just return a resolved promise so the flow continues
    return Promise.resolve();
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      // Check if we're using the admin or registered user token
      const token = localStorage.getItem('auth-token');
      
      // For admin or registered users
      if (token && (token.includes('admin_user_token') || token.includes('registered_user_token'))) {
        // Get the current user data from localStorage
        const currentUser = JSON.parse(localStorage.getItem('current-user') || '{}');
        if (currentUser && currentUser.email) {
          return {
            data: {
              id: currentUser.id,
              email: currentUser.email,
              full_name: currentUser.full_name,
              department: currentUser.department,
              is_admin: currentUser.is_admin || false,
              is_reviewer: currentUser.is_reviewer || false,
            }
          };
        }
      }
      
      // Otherwise use the real API
      return await apiClient.get('/users/me');
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    return apiClient.post('/auth/refresh', { refresh_token: refreshToken });
  },
};

export default authService;