import { configureStore } from '@reduxjs/toolkit';
 import themeReducer from './authSlice';
 
 export const store = configureStore({
   reducer: {
     theme: themeReducer,
   },
 });