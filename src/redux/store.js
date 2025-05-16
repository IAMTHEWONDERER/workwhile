// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here as your app grows
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types (useful for large non-serializable payloads)
        ignoredActions: ['auth/register/fulfilled', 'auth/login/fulfilled'],
      },
    }),
});

export default store;