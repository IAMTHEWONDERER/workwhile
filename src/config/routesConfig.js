// src/config/routesConfig.js

// Backend route configuration based on your Express routes
export const BACKEND_ROUTES = {
    // Auth routes (from authRoutes.js)
    AUTH: {
        BASE: '/auth',
        TEST: '/auth/test',
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        ME: '/auth/me'
    },

    // User routes (from userRoutes.js)
    USERS: {
        BASE: '/users',
        PROFILE: '/users/profile',
        CHANGE_PASSWORD: '/users/change-password',
        UPLOAD_AVATAR: '/users/upload-avatar',
        SAVED_JOBS: '/users/saved-jobs',
        SAVE_JOB: (jobId) => `/users/save-job/${jobId}`,
        USER_BY_ID: (id) => `/users/${id}`,
        UPDATE_STATUS: (id) => `/users/${id}/status`
    },

    // Job routes (from jobRoutes.js)
    JOBS: {
        BASE: '/jobs',
        JOB_BY_ID: (id) => `/jobs/${id}`,
        MY_JOBS: '/jobs/my/jobs'
    },

    // Application routes (from applicationRoutes.js)
    APPLICATIONS: {
        BASE: '/applications',
        MY_APPLICATIONS: '/applications/my',
        JOB_APPLICATIONS: (jobId) => `/applications/job/${jobId}`,
        UPDATE_STATUS: (id) => `/applications/${id}/status`,
        WITHDRAW: (id) => `/applications/${id}/withdraw`
    },

    // Company routes (from companyRoutes.js)
    COMPANIES: {
        BASE: '/companies',
        COMPANY_BY_ID: (id) => `/companies/${id}`,
        MY_COMPANY: '/companies/my/company'
    }
};

// Helper function to build full URL
export const buildApiUrl = (route) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${baseUrl}${route}`;
};