import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../api/authService';

/**
 * Register a new user
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      
      // Store token and user info in localStorage for persistence
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

/**
 * Login a user
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      
      // Store token and user info in localStorage for persistence
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

/**
 * Logout the current user
 */
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      
      // Remove token and user info from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return null;
    } catch (error) {
      // Even if the API call fails, we want to clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

/**
 * Check if user is already authenticated
 */
export const checkAuthState = createAsyncThunk(
  'auth/checkState',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        return null;
      }
      
      const user = JSON.parse(userStr);
      
      // Optionally validate the token with the server
      // const profile = await authService.getUserProfile();
      
      return { user, token };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue(error.message || 'Authentication check failed');
    }
  }
);

/**
 * Complete profile setup for new users
 */
export const completeProfileSetup = createAsyncThunk(
  'auth/completeProfileSetup',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      // This is where you would call an API to save the profile data
      // For now, we'll just simulate a successful update
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const { user } = getState().auth;
      if (!user) {
        return rejectWithValue('User not authenticated');
      }
      
      // Update the user profile with the new data
      const updatedUser = {
        ...user,
        needsProfileSetup: false, // Mark profile setup as completed
        profileCompleted: true,
        ...profileData
      };
      
      // In a real scenario, you would call API here
      // const response = await userService.updateProfile(updatedUser);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message || 'Profile setup failed');
    }
  }
);