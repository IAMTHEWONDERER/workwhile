import { API_URLS, createApiClient } from '../config/apiConfig';

const applicationClient = createApiClient(API_URLS.APPLICATIONS);

const applicationService = {
  /**
   * Get all applications with pagination
   * @param {number} page - Page number (default: 0)
   * @param {number} size - Number of records per page (default: 10)
   * @returns {Promise<Object>} Paginated list of applications
   */
  getAllApplications: async (page = 0, size = 10) => {
    const response = await applicationClient.get('', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Get a specific application by ID
   * @param {string} id - The application ID
   * @returns {Promise<Object>} The application details
   */
  getApplicationById: async (id) => {
    const response = await applicationClient.get(`/${id}`);
    return response.data;
  },

  /**
   * Get all applications for a specific user
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} List of user's applications
   */
  getUserApplications: async (userId) => {
    const response = await applicationClient.get(`/user/${userId}`);
    return response.data;
  },

  /**
   * Get all applications for a specific job
   * @param {string} jobId - The job ID
   * @returns {Promise<Array>} List of applications for the job
   */
  getJobApplications: async (jobId) => {
    const response = await applicationClient.get(`/job/${jobId}`);
    return response.data;
  },

  /**
   * Check if a user has applied to a job
   * @param {string} userId - The user ID
   * @param {string} jobId - The job ID
   * @returns {Promise<boolean>} Whether the user has applied
   */
  hasUserAppliedToJob: async (userId, jobId) => {
    const response = await applicationClient.get('/check', {
      params: { userId, jobId }
    });
    return response.data;
  },

  /**
   * Create a new job application
   * @param {FormData} formData - The application data including files
   * @returns {Promise<Object>} The created application
   */
  createApplication: async (formData) => {
    try {
      console.log('Submitting application with data:', {
        jobId: formData.get('jobId'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phoneNumber: formData.get('phoneNumber'),
        coverLetter: formData.get('coverLetter'),
        resumeFileName: formData.get('resumeFileName'),
        additionalFileNames: formData.getAll('additionalFileNames')
      });

      const response = await applicationClient.post('', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Application submitted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting application:', error);
      if (error.code === 'ERR_NETWORK' || error.message.includes('ECONNREFUSED')) {
        throw new Error('Unable to connect to the server. Please ensure the backend service is running on port 8084.');
      }
      throw new Error(error.response?.data?.message || 'Failed to submit application. Please try again.');
    }
  },

  /**
   * Update the status of an application
   * @param {string} id - The application ID
   * @param {string} status - The new status
   * @returns {Promise<Object>} The updated application
   */
  updateApplicationStatus: async (id, status) => {
    const response = await applicationClient.patch(`/${id}/status`, { status });
    return response.data;
  }
};

export default applicationService; 