// src/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  logoutUser,
  checkAuthState,
  completeProfileSetup,
  updateUserProfile
} from './authActions';

const initialState = {
  user: null,
  token: null,
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
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
        // Register cases
        .addCase(registerUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        })
        .addCase(registerUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Login cases
        .addCase(loginUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Logout cases
        .addCase(logoutUser.pending, (state) => {
          state.loading = true;
        })
        .addCase(logoutUser.fulfilled, (state) => {
          state.loading = false;
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.error = null;
        })
        .addCase(logoutUser.rejected, (state) => {
          state.loading = false;
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.error = null;
        })

        // Check auth state cases
        .addCase(checkAuthState.pending, (state) => {
          state.loading = true;
        })
        .addCase(checkAuthState.fulfilled, (state, action) => {
          state.loading = false;
          if (action.payload) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
          } else {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
          }
        })
        .addCase(checkAuthState.rejected, (state, action) => {
          state.loading = false;
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.error = action.payload;
        })

        // Complete profile setup cases
        .addCase(completeProfileSetup.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(completeProfileSetup.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
        })
        .addCase(completeProfileSetup.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Update profile cases
        .addCase(updateUserProfile.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateUserProfile.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
        })
        .addCase(updateUserProfile.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
  },
});

export const { clearError, setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;