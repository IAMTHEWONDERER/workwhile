// src/services/companyService.js
import apiClient, { API_ENDPOINTS, handleApiError } from '../config/apiConfig';

const companyService = {
    /**
     * Get all companies
     */
    getAllCompanies: async (filters = {}) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.COMPANIES.BASE, {
                params: filters
            });
            return response.data.data;
        } catch (error) {
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get company by ID
     */
    getCompanyById: async (id) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.COMPANIES.BY_ID(id));
            return response.data.data;
        } catch (error) {
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Create company (employer only)
     */
    createCompany: async (companyData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.COMPANIES.BASE, companyData);
            return response.data.data;
        } catch (error) {
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get my company (employer only)
     */
    getMyCompany: async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.COMPANIES.MY_COMPANY);
            return response.data.data;
        } catch (error) {
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Update my company (employer only)
     */
    updateMyCompany: async (companyData) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.COMPANIES.MY_COMPANY, companyData);
            return response.data.data;
        } catch (error) {
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Search companies
     */
    searchCompanies: async (searchParams) => {
        try {
            const {
                search,
                industry,
                page = 1,
                limit = 10
            } = searchParams;

            const params = { page, limit };
            if (search) params.search = search;
            if (industry) params.industry = industry;

            const response = await apiClient.get(API_ENDPOINTS.COMPANIES.BASE, { params });
            return response.data.data;
        } catch (error) {
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    }
};

export default companyService;