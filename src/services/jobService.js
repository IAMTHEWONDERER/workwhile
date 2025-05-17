import { API_URLS, createApiClient, handleApiError } from '../config/apiConfig';

const jobsClient = createApiClient(API_URLS.JOBS);
const applicationsClient = createApiClient(API_URLS.APPLICATIONS);

const jobService = {
  // Get all jobs with optional filters
  getAllJobs: async (filters = {}) => {
    try {
      const response = await jobsClient.get('');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get job by ID
  getJobById: async (id) => {
    try {
      const response = await jobsClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Save job
  saveJob: async (jobId) => {
    try {
      const response = await jobsClient.post(`/${jobId}/save`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Remove saved job
  removeSavedJob: async (jobId) => {
    try {
      const response = await jobsClient.delete(`/${jobId}/save`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get user's saved jobs
  getSavedJobs: async () => {
    try {
      const response = await jobsClient.get('/saved');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get user's applications
  getUserApplications: async () => {
    try {
      const response = await applicationsClient.get('/my-applications');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default jobService;
