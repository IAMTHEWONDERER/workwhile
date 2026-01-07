// src/services/userService.js
import apiClient, { API_ENDPOINTS, handleApiError } from '../config/apiConfig';

const userService = {
    /**
     * Get user profile
     */
    getProfile: async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
            return response.data.data;
        } catch (error) {
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Update user profile
     */
    updateProfile: async (profileData) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.USERS.PROFILE, profileData);
            return response.data.data;
        } catch (error) {
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Change password
     */
    changePassword: async (passwordData) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.USERS.CHANGE_PASSWORD, passwordData);
            return response.data;
        } catch (error) {
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Upload avatar
     */
    uploadAvatar: async (avatarUrl) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.USERS.UPLOAD_AVATAR, {
                avatarUrl
            });
            return response.data.data;
        } catch (error) {
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get saved jobs
     */
    getSavedJobs: async (page = 1, limit = 10) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.USERS.SAVED_JOBS, {
                params: { page, limit }
            });
            return response.data.data;
        } catch (error) {
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Save a job
     */
    saveJob: async (jobId) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.USERS.SAVE_JOB(jobId));
            return response.data;
        } catch (error) {
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Unsave a job
     */
    unsaveJob: async (jobId) => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.USERS.SAVE_JOB(jobId));
            return response.data;
        } catch (error) {
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    }
};

export default userService;