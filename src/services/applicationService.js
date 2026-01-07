// src/services/applicationService.js
import apiClient, { API_ENDPOINTS, handleApiError } from '../config/apiConfig';

const applicationService = {
  /**
   * Create a new job application
   */
  createApplication: async (applicationData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.APPLICATIONS.BASE, applicationData);
      return response.data.data;
    } catch (error) {
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Get my applications (candidate)
   */
  getMyApplications: async (filters = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.APPLICATIONS.MY_APPLICATIONS, {
        params: filters
      });
      return response.data.data;
    } catch (error) {
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Get applications for a specific job (employer)
   */
  getJobApplications: async (jobId, filters = {}) => {
    try {
      const response = await apiClient.get(
          API_ENDPOINTS.APPLICATIONS.JOB_APPLICATIONS(jobId),
          { params: filters }
      );
      return response.data.data;
    } catch (error) {
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Update application status (employer)
   */
  updateApplicationStatus: async (applicationId, status, notes = '') => {
    try {
      const response = await apiClient.put(
          API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(applicationId),
          { status, notes }
      );
      return response.data.data;
    } catch (error) {
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Withdraw application (candidate)
   */
  withdrawApplication: async (applicationId) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.APPLICATIONS.WITHDRAW(applicationId));
      return response.data.data;
    } catch (error) {
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Check if user has applied to a job
   */
  hasUserAppliedToJob: async (jobId) => {
    try {
      const applications = await this.getMyApplications({ jobId });
      return applications.applications && applications.applications.length > 0;
    } catch (error) {
      console.error('Error checking application status:', error);
      return false;
    }
  },

  /**
   * Get application statistics (for dashboard)
   */
  getApplicationStats: async () => {
    try {
      const applications = await this.getMyApplications();
      const stats = {
        total: applications.applications?.length || 0,
        pending: 0,
        reviewing: 0,
        shortlisted: 0,
        interviewed: 0,
        offered: 0,
        rejected: 0,
        withdrawn: 0
      };

      applications.applications?.forEach(app => {
        if (Object.prototype.hasOwnProperty.call(stats, app.status)) {
          stats[app.status]++;
        }
      });

      return stats;
    } catch (error) {
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  }
};

export default applicationService;