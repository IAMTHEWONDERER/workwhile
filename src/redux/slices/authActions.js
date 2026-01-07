// src/slices/authActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../api/authService';

/**
 * Register a new user
 */
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
      try {
        console.log('Dispatching registerUser with data:', userData);
        const response = await authService.register(userData);
        return response;
      } catch (error) {
        console.error('Register error:', error);
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
        console.log('Dispatching loginUser with:', credentials);
        const response = await authService.login(credentials);
        return response;
      } catch (error) {
        console.error('Login error:', error);
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
        return null;
      } catch (error) {
        // Even if the API call fails, we want to clear local storage
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

        // Verify token with backend and return fresh user data
        try {
          const profileData = await authService.getUserProfile();
          return {
            user: profileData.user || user, // Use fresh data or fallback to stored
            token
          };
        } catch (tokenError) {
          console.warn('Token verification failed:', tokenError.message);
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return null;
        }
      } catch (parseError) {
        console.error('Auth state check failed:', parseError.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return rejectWithValue(parseError.message || 'Authentication check failed');
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
        // Simulate API call - replace with real API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { user } = getState().auth;
        if (!user) {
          return rejectWithValue('User not authenticated');
        }

        // Update the user profile with the new data
        const updatedUser = {
          ...user,
          needsProfileSetup: false,
          profileCompleted: true,
          ...profileData
        };

        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));

        return updatedUser;
      } catch (error) {
        return rejectWithValue(error.message || 'Profile setup failed');
      }
    }
);

/**
 * Update user profile
 */
export const updateUserProfile = createAsyncThunk(
    'auth/updateProfile',
    async (profileData, { rejectWithValue }) => {
      try {
        // TODO: Implement authService.updateProfile when backend endpoint is ready
        console.warn('updateProfile API not implemented yet');

        // For now, simulate the update
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...profileData };

        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));

        return updatedUser;
      } catch (error) {
        return rejectWithValue(error.message || 'Profile update failed');
      }
    }
);