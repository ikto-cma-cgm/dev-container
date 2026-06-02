/**
 * Test Data
 * Centralized test data for E2E tests
 */

module.exports = {
    users: {
        valid: {
            username: 'testuser',
            password: 'TestPassword123!',
            email: 'testuser@example.com'
        },
        invalid: {
            username: 'invaliduser',
            password: 'wrongpassword'
        },
        admin: {
            username: 'admin',
            password: 'AdminPassword123!',
            email: 'admin@example.com'
        }
    },

    urls: {
        home: '/',
        login: '/login',
        signup: '/signup',
        dashboard: '/dashboard',
        profile: '/profile'
    },

    products: {
        sample: {
            name: 'Test Product',
            description: 'This is a test product',
            price: 99.99,
            category: 'Electronics'
        }
    },

    forms: {
        contact: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            subject: 'Test Subject',
            message: 'This is a test message from E2E tests'
        }
    }
};
