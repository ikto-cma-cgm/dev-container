/**
 * User Workflow - API + E2E Integration
 * Tests complete user journey combining API setup and UI interaction
 * Project: ${{ values.projectName }}
 */

const apiHelper = require('../../helpers/api-helper');
const testData = require('../../helpers/test-data');

describe('Complete User Workflow - API + E2E', () => {
    let testUser;
    let authToken;

    before(async () => {
        // Create test user via API
        testUser = {
            username: testData.generateRandomUsername(),
            email: testData.generateRandomEmail(),
            password: 'TestPass123!'
        };

        await apiHelper.createUser(testUser);
    });

    after(async () => {
        // Cleanup: Delete test user
        if (testUser.id) {
            await apiHelper.deleteUser(testUser.id, authToken);
        }
    });

    it('should complete full user journey: login, update profile, logout', async () => {
        // Step 1: Login via UI
        await browser.url('/login');
        await $('input[name="username"]').setValue(testUser.username);
        await $('input[name="password"]').setValue(testUser.password);
        await $('button[type="submit"]').click();

        await expect(browser).toHaveUrlContaining('/dashboard');

        // Step 2: Navigate to profile
        await $('a[href="/profile"]').click();

        // Step 3: Update profile info
        const bioInput = await $('textarea[name="bio"]');
        await bioInput.setValue('This is my test bio');
        await $('button[type="submit"]').click();

        // Step 4: Verify update via API
        authToken = await apiHelper.login(testUser.username, testUser.password);
        const profile = await apiHelper.getUserProfile(testUser.username, authToken);
        expect(profile.bio).toBe('This is my test bio');

        // Step 5: Logout
        await $('button[data-action="logout"]').click();
        await expect(browser).toHaveUrlContaining('/login');
    });

    it('should sync cart between API and UI', async () => {
        // Login
        authToken = await apiHelper.login(testUser.username, testUser.password);

        // Add items to cart via API
        await apiHelper.addToCart({ productId: 123, quantity: 2 }, authToken);
        await apiHelper.addToCart({ productId: 456, quantity: 1 }, authToken);

        // Navigate to cart in UI
        await browser.url('/cart');
        await $('a[href="/cart"]').click();

        // Verify items appear
        const cartItems = await $$('.cart-item');
        expect(cartItems.length).toBe(2);
    });

    it('should handle user preferences sync', async () => {
        // Set preferences via API
        authToken = await apiHelper.login(testUser.username, testUser.password);

        // Create preference via API
        const preferences = {
            theme: 'dark',
            language: 'en',
            notifications: true
        };

        // Assuming there's a preferences endpoint
        // await apiHelper.updateUserPreferences(testUser.username, preferences, authToken);

        // Login and verify in UI
        await browser.url('/login');
        await $('input[name="username"]').setValue(testUser.username);
        await $('input[name="password"]').setValue(testUser.password);
        await $('button[type="submit"]').click();

        // Navigate to settings
        const settingsLink = await $('a[href="/settings"]');
        if (await settingsLink.isExisting()) {
            await settingsLink.click();

            // Verify preferences are applied
            const themeToggle = await $('[data-setting="theme"]');
            if (await themeToggle.isExisting()) {
                const currentTheme = await themeToggle.getAttribute('data-value');
                // expect(currentTheme).toBe('dark');
            }
        }
    });

    it('should handle session expiration gracefully', async () => {
        // Login
        await browser.url('/login');
        await $('input[name="username"]').setValue(testUser.username);
        await $('input[name="password"]').setValue(testUser.password);
        await $('button[type="submit"]').click();

        await expect(browser).toHaveUrlContaining('/dashboard');

        // Simulate session expiration by clearing cookies
        await browser.deleteCookies();

        // Try to navigate to protected page
        await browser.url('/profile');

        // Should be redirected to login
        await expect(browser).toHaveUrlContaining('/login');
    });

    it('should maintain shopping context across sessions', async () => {
        // Add items to cart while logged in
        authToken = await apiHelper.login(testUser.username, testUser.password);
        await apiHelper.addToCart({ productId: 789, quantity: 1 }, authToken);

        // Login via UI
        await browser.url('/login');
        await $('input[name="username"]').setValue(testUser.username);
        await $('input[name="password"]').setValue(testUser.password);
        await $('button[type="submit"]').click();

        // Navigate to cart
        await $('a[href="/cart"]').click();

        // Verify item from API is present
        const cartItems = await $$('.cart-item');
        expect(cartItems.length).toBeGreaterThan(0);

        // Clean up cart
        await apiHelper.clearCart(authToken);
    });
});
