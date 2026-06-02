const Page = require('./page');

/**
 * Signup Page Object
 * Represents the user registration page
 */
class SignupPage extends Page {
    /**
     * Define page elements
     */
    get inputUsername() {
        return $('input[name="username"]');
    }

    get inputEmail() {
        return $('input[name="email"]');
    }

    get inputPassword() {
        return $('input[name="password"]');
    }

    get inputConfirmPassword() {
        return $('input[name="confirmPassword"]');
    }

    get termsCheckbox() {
        return $('input[type="checkbox"][name="terms"]');
    }

    get btnSubmit() {
        return $('button[type="submit"]');
    }

    get errorMessage() {
        return $('.error-message, .alert-danger');
    }

    /**
     * Perform signup action
     * @param {Object} userData - User data object
     * @param {string} userData.username - Username
     * @param {string} userData.email - Email
     * @param {string} userData.password - Password
     * @param {string} userData.confirmPassword - Password confirmation
     */
    async signup(userData) {
        await this.setValue(this.inputUsername, userData.username);
        await this.setValue(this.inputEmail, userData.email);
        await this.setValue(this.inputPassword, userData.password);
        await this.setValue(this.inputConfirmPassword, userData.confirmPassword);

        if (await this.termsCheckbox.isExisting()) {
            await this.termsCheckbox.click();
        }

        await this.clickElement(this.btnSubmit);
    }

    /**
     * Open signup page
     */
    async open() {
        await super.open('/signup');
    }

    /**
     * Get email error message
     * @returns {Promise<string>} Email error text
     */
    async getEmailError() {
        const error = await $('input[name="email"] + .error, .email-error');
        return await error.getText();
    }

    /**
     * Get password error message
     * @returns {Promise<string>} Password error text
     */
    async getPasswordError() {
        const error = await $('input[name="password"] + .error, .password-error');
        return await error.getText();
    }

    /**
     * Get confirm password error message
     * @returns {Promise<string>} Confirm password error text
     */
    async getConfirmPasswordError() {
        const error = await $('input[name="confirmPassword"] + .error');
        return await error.getText();
    }

    /**
     * Get general error message
     * @returns {Promise<string>} Error message text
     */
    async getErrorMessage() {
        await this.waitForDisplayed(this.errorMessage);
        return await this.errorMessage.getText();
    }

    /**
     * Submit form
     */
    async submitForm() {
        await this.clickElement(this.btnSubmit);
    }
}

module.exports = new SignupPage();
