/**
 * Signup Form E2E Tests
 * Tests user registration flow
 * Project: ${{ values.projectName }}
 */

const SignupPage = require('../../pageobjects/signup.page');
const testData = require('../../helpers/test-data');

describe('Signup Form Tests', () => {
    beforeEach(async () => {
        await SignupPage.open();
    });

    it('should successfully register a new user', async () => {
        const newUser = {
            username: testData.generateRandomUsername(),
            email: testData.generateRandomEmail(),
            password: 'SecurePass123!',
            confirmPassword: 'SecurePass123!'
        };

        await SignupPage.signup(newUser);
        await expect(browser).toHaveUrlContaining('/welcome');
    });

    it('should validate email format', async () => {
        await SignupPage.inputEmail.setValue('invalid-email');
        await SignupPage.submitForm();
        const errorMsg = await SignupPage.getEmailError();
        expect(errorMsg).toContain('valid email');
    });

    it('should validate password strength', async () => {
        await SignupPage.inputPassword.setValue('weak');
        await SignupPage.submitForm();
        const errorMsg = await SignupPage.getPasswordError();
        expect(errorMsg).toMatch(/(strong|characters|uppercase|number)/i);
    });

    it('should validate password confirmation match', async () => {
        await SignupPage.inputPassword.setValue('Password123!');
        await SignupPage.inputConfirmPassword.setValue('Password456!');
        await SignupPage.submitForm();
        const errorMsg = await SignupPage.getConfirmPasswordError();
        expect(errorMsg).toContain('match');
    });

    it('should prevent duplicate username registration', async () => {
        const existingUser = testData.users.valid;
        await SignupPage.signup({
            username: existingUser.username,
            email: testData.generateRandomEmail(),
            password: 'NewPass123!',
            confirmPassword: 'NewPass123!'
        });
        const errorMsg = await SignupPage.getErrorMessage();
        expect(errorMsg).toMatch(/(already exists|taken|unavailable)/i);
    });
});
