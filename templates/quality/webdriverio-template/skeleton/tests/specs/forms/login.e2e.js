/**
 * Login Form E2E Tests
 * Tests comprehensive login scenarios
 * Project: ${{ values.projectName }}
 */

const LoginPage = require('../../pageobjects/login.page');
const testData = require('../../helpers/test-data');

describe('Login Form Tests', () => {
    beforeEach(async () => {
        await LoginPage.open();
    });

    it('should successfully login with valid credentials', async () => {
        await LoginPage.login(testData.users.valid.username, testData.users.valid.password);
        await expect(browser).toHaveUrlContaining('/dashboard');
    });

    it('should display error message with invalid credentials', async () => {
        await LoginPage.login(testData.users.invalid.username, testData.users.invalid.password);
        const errorMsg = await LoginPage.getErrorMessage();
        expect(errorMsg).toContain('Invalid username or password');
    });

    it('should validate required fields', async () => {
        await LoginPage.submitForm();
        await expect(LoginPage.inputUsername).toHaveAttribute('required');
        await expect(LoginPage.inputPassword).toHaveAttribute('required');
    });

    it('should toggle password visibility', async () => {
        await LoginPage.inputPassword.setValue('secret');
        const initialType = await LoginPage.inputPassword.getAttribute('type');
        expect(initialType).toBe('password');

        const toggleBtn = await LoginPage.passwordToggle;
        if (await toggleBtn.isExisting()) {
            await toggleBtn.click();
            const newType = await LoginPage.inputPassword.getAttribute('type');
            expect(newType).toBe('text');
        }
    });

    it('should navigate to forgot password page', async () => {
        const forgotPasswordLink = await LoginPage.forgotPasswordLink;
        if (await forgotPasswordLink.isExisting()) {
            await forgotPasswordLink.click();
            await expect(browser).toHaveUrlContaining('/forgot-password');
        }
    });
});
