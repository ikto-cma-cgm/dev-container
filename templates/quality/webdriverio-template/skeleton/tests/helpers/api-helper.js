/**
 * API Helper
 * Utility functions for API interactions in E2E tests
 * Project: ${{ values.projectName }}
 */

const baseUrl = process.env.API_BASE_URL || '${{ values.baseUrl }}';

class ApiHelper {
    /**
     * Make HTTP request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} Response data
     */
    async request(endpoint, options = {}) {
        const url = `${baseUrl}${endpoint}`;

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw {
                status: response.status,
                message: error.message || response.statusText,
                details: error
            };
        }

        return await response.json();
    }

    /**
     * Login and get auth token
     * @param {string} username - Username
     * @param {string} password - Password
     * @returns {Promise<string>} Auth token
     */
    async login(username, password) {
        const response = await this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        return response.token || response.access_token;
    }

    /**
     * Create user
     * @param {Object} userData - User data
     * @returns {Promise<Object>} Created user
     */
    async createUser(userData) {
        return await this.request('/api/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    /**
     * Delete user
     * @param {string} userId - User ID
     * @param {string} token - Auth token
     * @returns {Promise<Object>} Delete response
     */
    async deleteUser(userId, token) {
        return await this.request(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    /**
     * Get user profile
     * @param {string} username - Username
     * @param {string} token - Auth token
     * @returns {Promise<Object>} User profile
     */
    async getUserProfile(username, token) {
        return await this.request(`/api/users/${username}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}

module.exports = new ApiHelper();
