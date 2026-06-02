/**
 * Example E2E Test
 * Project: my-awesome-app
 * Test Type: e2e
 * Framework: mocha
 */

const LoginPage = require('../pageobjects/login.page');

describe('my-awesome-app - Example E2E Test Suite', () => {

    it('should load the homepage', async () => {
        await browser.url('/');
        await browser.waitUntil(
            async () => await browser.execute(() => document.readyState) === 'complete',
            {
                timeout: 60000,
                timeoutMsg: 'Page did not load within 60 seconds'
            }
        );

        await expect(browser).toHaveUrl(expect.stringContaining('http://localhost:3000'));
    });

    it('should have the correct page title', async () => {
        await browser.url('/');
        const title = await browser.getTitle();
        expect(title).toBeDefined();
        expect(title.length).toBeGreaterThan(0);
    });

    it('should navigate to login page', async () => {
        await browser.url('/');

        const loginLink = await $('a[href="/login"]');
        if (await loginLink.isExisting()) {
            await loginLink.waitForDisplayed();
            await loginLink.click();
            await expect(browser).toHaveUrl(expect.stringContaining('/login'));
        }
    });

    it('should display login form elements', async () => {
        await browser.url('/login');

        const usernameInput = await $('input[name="username"]');
        const passwordInput = await $('input[name="password"]');
        const submitButton = await $('button[type="submit"]');

        if (await usernameInput.isExisting()) {
            await expect(usernameInput).toBeDisplayed();
        }
        if (await passwordInput.isExisting()) {
            await expect(passwordInput).toBeDisplayed();
        }
        if (await submitButton.isExisting()) {
            await expect(submitButton).toBeDisplayed();
        }
    });

    // Example with Page Object Model
    it('should login with valid credentials using Page Object', async () => {
        await LoginPage.open();

        // Update these credentials based on your application
        await LoginPage.login('testuser', 'testpassword');

        // Verify successful login (adjust URL as needed)
        await expect(browser).toHaveUrlContaining('/dashboard');
    });

    it('should display error with invalid credentials', async () => {
        await LoginPage.open();
        await LoginPage.login('invalid', 'invalid');

        // Check for error message (adjust selector as needed)
        const errorMessage = await $('.error-message, .flash-message, .alert-danger');
        if (await errorMessage.isExisting()) {
            await expect(errorMessage).toBeDisplayed();
        }
    });

    afterEach(async function() {
        // Take screenshot on test failure
        if (this.currentTest && this.currentTest.state === 'failed') {
            const testName = this.currentTest.title.replace(/\s+/g, '_');
            await browser.saveScreenshot(`./test-results/screenshots/${testName}_${Date.now()}.png`);
        }
    });
});
