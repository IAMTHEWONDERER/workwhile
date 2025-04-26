// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we're just simulating a successful login
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user data
      const userData = {
        id: '123',
        email: credentials.email,
        name: 'Demo User',
        role: credentials.role || 'jobseeker',
      };
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we're just simulating a successful registration
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock new user
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        name: userData.name || 'New User',
        role: userData.role || 'jobseeker',
      };
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      return newUser;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('currentUser');
    return null;
  }
);

// Async thunk to check if user is already logged in
export const checkAuthState = createAsyncThunk(
  'auth/checkState',
  async () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return null;
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      
      // Check auth state cases
      .addCase(checkAuthState.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;