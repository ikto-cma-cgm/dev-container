/**
 * Test Data Helper
 * Centralized test data management
 */

module.exports = {
    users: {
        valid: {
            username: 'testuser',
            password: 'testpassword',
            email: 'testuser@example.com'
        },
        invalid: {
            username: 'invaliduser',
            password: 'wrongpassword'
        },
        admin: {
            username: 'admin',
            password: 'adminpassword',
            email: 'admin@example.com'
        }
    },

    urls: {
        base: '{{ values.baseUrl }}',
        login: '{{ values.baseUrl }}/login',
        dashboard: '{{ values.baseUrl }}/dashboard',
        profile: '{{ values.baseUrl }}/profile'
    },

    timeouts: {
        short: 5000,
        medium: 10000,
        long: 30000,
        veryLong: 60000
    },

    /**
     * Generate random email
     * @returns {string} Random email address
     */
    generateRandomEmail() {
        const timestamp = Date.now();
        return `test.user.${timestamp}@example.com`;
    },

    /**
     * Generate random username
     * @returns {string} Random username
     */
    generateRandomUsername() {
        const timestamp = Date.now();
        return `testuser_${timestamp}`;
    },

    products: {
        valid: {
            name: 'Test Product',
            price: 99.99,
            category: 'Electronics',
            description: 'A test product for E2E testing'
        },
        invalid: {
            name: '',
            price: -10,
            category: ''
        }
    },

    forms: {
        contact: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            subject: 'Test Inquiry',
            message: 'This is a test message for E2E testing'
        }
    },

    /**
     * Generate test product
     * @returns {Object} Test product data
     */
    generateTestProduct() {
        return {
            name: `Product_${Date.now()}`,
            price: Math.floor(Math.random() * 1000) + 10,
            category: 'Test Category',
            sku: `SKU-${Date.now()}`
        };
    }
};
