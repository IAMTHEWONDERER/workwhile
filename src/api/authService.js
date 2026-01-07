import apiClient from './apiClient';

// Define API endpoints for auth
const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  USER_PROFILE: '/users/profile'
};

// Auth service with all auth-related API calls
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - The API response
   */
  register: async (userData) => {
    try {
        console.log('Attempting to register with data:', userData);
        
        // Create a formatted payload that matches what your backend expects
        const payload = {
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username || userData.email.split('@')[0],
          role: userData.role
        };
        
        console.log('Formatted payload:', payload);
        
        // Make the request
        const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, payload);
        console.log('Registration successful:', response);
        return response.data;
      } catch (error) {
        console.error('Registration error:', error);
        
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Request setup error:', error.message);
        }
        
        throw error?.response?.data || { message: error.message || 'Registration failed' };
      }
    },

  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise} - The API response
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials);
      return response.data;
    } catch (error) {
      throw error?.response?.data || { message: 'Login failed' };
    }
  },

  /**
   * Logout the current user
   * @returns {Promise} - The API response
   */
  logout: async () => {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
      return response.data;
    } catch (error) {
      // If logout fails, still clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error?.response?.data || { message: 'Logout failed' };
    }
  },

  /**
   * Get the current user's profile
   * @returns {Promise} - The API response
   */
  getUserProfile: async () => {
    try {
      const response = await apiClient.get(AUTH_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      throw error?.response?.data || { message: 'Failed to get user profile' };
    }
  }
};

export default authService;