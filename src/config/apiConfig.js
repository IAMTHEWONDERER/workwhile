// src/api/apiConfig.js
import axios from 'axios';

// Base URLs for the different services
const API_URLS = {
  AUTH: 'http://localhost:8081/api/v1/auth',
  USERS: 'http://localhost:8081/api/v1/users',
  CANDIDATES: 'http://localhost:8082/api/v1/candidates',
  JOBS: 'http://localhost:8083/api/v1/jobs',
  APPLICATIONS: 'http://localhost:8084/api/v1/applications'
};

/**
 * Create an axios instance with common configuration for a specific API
 * @param {string} baseURL - The base URL for the API
 * @returns {import('axios').AxiosInstance} - Configured axios instance
 */
const createApiClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    },
    // Ensure cookies are sent with requests if needed
    withCredentials: true
  });

  // Add a request interceptor to add auth token to every request
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor to handle common errors
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      // Get original request
      const originalRequest = error.config;
      
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Here you would implement token refresh logic if applicable
          // For now, we'll just redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          window.location.href = '/login';
          return Promise.reject(error);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      
      // Handle other errors
      return Promise.reject(handleApiError(error));
    }
  );

  return client;
};

/**
 * Helper function to standardize error handling across services
 * @param {Error} error - The error object from axios
 * @returns {Error} - Standardized error object
 */
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const errorMessage = error.response.data.message || 
                         error.response.data.error || 
                         'An error occurred during the request';
    return new Error(errorMessage);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Request made but no response received:', error.request);
    return new Error('No response received from server. Please check your connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error during request setup:', error.message);
    return new Error('Failed to make request. Please try again later.');
  }
};

// Export the API URLs and client creation function
export { API_URLS, createApiClient, handleApiError };