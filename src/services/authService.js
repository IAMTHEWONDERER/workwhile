// src/api/authService.js
import { createApiClient, handleApiError } from '../config/apiConfig';
import { BACKEND_ROUTES, buildApiUrl } from '../config/routesConfig';

const authClient = createApiClient();

const authService = {
    /**
     * Register a new user
     */
    register: async (userData) => {
        try {
            const payload = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,
                role: userData.role || 'candidate'
            };

            console.log('🚀 Registering user with payload:', payload);
            const url = buildApiUrl(BACKEND_ROUTES.AUTH.REGISTER);
            console.log('🔗 Register URL:', url);

            const response = await authClient.post(url, payload);

            // Store token and user data
            if (response.data.data?.token) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }

            return response.data.data;
        } catch (error) {
            console.error('❌ Register error:', error);
            throw handleApiError(error);
        }
    },

    /**
     * Login user
     */
    login: async (credentials) => {
        try {
            console.log('🚀 Logging in user with credentials:', credentials);
            const url = buildApiUrl(BACKEND_ROUTES.AUTH.LOGIN);
            console.log('🔗 Login URL:', url);

            const response = await authClient.post(url, credentials);

            // Store token and user data
            if (response.data.data?.token) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }

            return response.data.data;
        } catch (error) {
            console.error('❌ Login error:', error);

            // Enhanced error handling
            if (error.response?.status === 404) {
                throw new Error('The route /api/auth/login does not exist on this server');
            }

            throw handleApiError(error);
        }
    },

    /**
     * Logout user
     */
    logout: async () => {
        try {
            const url = buildApiUrl(BACKEND_ROUTES.AUTH.LOGOUT);
            await authClient.post(url);
        } catch (error) {
            console.warn('Logout API call failed:', error);
        } finally {
            // Always clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    /**
     * Get current user profile
     */
    getUserProfile: async () => {
        try {
            const url = buildApiUrl(BACKEND_ROUTES.AUTH.ME);
            const response = await authClient.get(url);
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Forgot password
     */
    forgotPassword: async (email) => {
        try {
            const url = buildApiUrl(BACKEND_ROUTES.AUTH.FORGOT_PASSWORD);
            const response = await authClient.post(url, { email });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Reset password
     */
    resetPassword: async (token, password) => {
        try {
            const url = buildApiUrl(BACKEND_ROUTES.AUTH.RESET_PASSWORD);
            const response = await authClient.post(url, {
                token,
                password
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

export default authService;