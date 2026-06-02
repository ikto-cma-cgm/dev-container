/**
 * Example E2E Test
 * Project: ${{ values.projectName }}
 * Test Type: ${{ values.testType or 'e2e' }}
 * Framework: ${{ values.testFramework }}
 */

const LoginPage = require('../pageobjects/login.page');

describe('${{ values.projectName }} - Example E2E Test Suite', () => {

    it('should load the homepage', async () => {
        await browser.url('/');
        // Wait for page to be ready
        await browser.waitUntil(
            async () => await browser.execute(() => document.readyState) === 'complete',
            {
                timeout: 30000,
                timeoutMsg: 'Page did not load within 30 seconds'
            }
        );

        await expect(browser).toHaveUrl(expect.stringContaining('${{ values.baseUrl }}'));
    });

    it('should have a page title', async () => {
        await browser.url('/');
        const title = await browser.getTitle();
        // Use chaiExpect for non-WDIO assertions
        if (global.chaiExpect) {
            global.chaiExpect(title).to.be.a('string');
        }
        await expect(browser).toHaveTitle(expect.stringMatching(/.+/));
    });

    it('should navigate to login page if link exists', async () => {
        await browser.url('/');

        const loginLink = await $('a[href*="login"]');
        if (await loginLink.isExisting()) {
            await loginLink.click();
            await expect(browser).toHaveUrl(expect.stringContaining('login'));
        } else {
            console.log('Login link not found, skipping navigation test');
        }
    });

    it('should display login form elements on /login', async () => {
        await browser.url('/login');

        const usernameInput = await $('input[name="username"], #username');
        const submitButton = await $('button[type="submit"], #submit');

        if (await usernameInput.isExisting()) {
            await expect(usernameInput).toBeDisplayed();
        }
        if (await submitButton.isExisting()) {
            await expect(submitButton).toBeDisplayed();
        }
    });

    // Example with Page Object Model
    it('should attempt login using Page Object', async () => {
        await LoginPage.open();

        // Update these credentials based on your application
        await LoginPage.login('testuser', 'testpassword');
    });

    {% if values.enableScreenshots %}
    afterEach(async function () {
        if (this.currentTest && this.currentTest.state === 'failed') {
            console.log(`Test failed: ${this.currentTest.title}`);
        }
    });
    {% endif %}
});
