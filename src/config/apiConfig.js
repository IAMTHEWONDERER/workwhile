// src/config/apiConfig.js
import axios from 'axios';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_URLS = {
  AUTH: `${API_BASE_URL}/auth`,
  USERS: `${API_BASE_URL}/users`,
  JOBS: `${API_BASE_URL}/jobs`,
  APPLICATIONS: `${API_BASE_URL}/applications`,
  COMPANIES: `${API_BASE_URL}/companies`
};

// Create API client with interceptors
export const createApiClient = (baseURL = API_BASE_URL) => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 10000
  });

  // Request interceptor - Add auth token
  client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
  );

  // Response interceptor - Handle common errors
  client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
  );

  return client;
};

// Default API client
export const apiClient = createApiClient();

// Error handler utility
export const handleApiError = (error) => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    return {
      message: 'Network error - please check your connection',
      status: 0
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0
    };
  }
};