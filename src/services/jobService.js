// src/api/jobService.js
import { createApiClient, handleApiError } from '../config/apiConfig';
import { BACKEND_ROUTES, buildApiUrl } from '../config/routesConfig';

const jobClient = createApiClient();

const jobService = {
  /**
   * Get all jobs with optional filters
   */
  getAllJobs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const url = buildApiUrl(BACKEND_ROUTES.JOBS.BASE);
      const response = await jobClient.get(`${url}?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get job by ID
   */
  getJobById: async (id) => {
    try {
      const url = buildApiUrl(BACKEND_ROUTES.JOBS.JOB_BY_ID(id));
      const response = await jobClient.get(url);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create new job (employer only)
   */
  createJob: async (jobData) => {
    try {
      const url = buildApiUrl(BACKEND_ROUTES.JOBS.BASE);
      const response = await jobClient.post(url, jobData);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update job (employer only)
   */
  updateJob: async (id, jobData) => {
    try {
      const url = buildApiUrl(BACKEND_ROUTES.JOBS.JOB_BY_ID(id));
      const response = await jobClient.put(url, jobData);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete job (employer only)
   */
  deleteJob: async (id) => {
    try {
      const url = buildApiUrl(BACKEND_ROUTES.JOBS.JOB_BY_ID(id));
      const response = await jobClient.delete(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get my jobs (employer only)
   */
  getMyJobs: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params);
      const url = buildApiUrl(BACKEND_ROUTES.JOBS.MY_JOBS);
      const response = await jobClient.get(`${url}?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default jobService;