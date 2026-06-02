/**
 * Login Page Object
 * Contains selectors and methods for the login page
 */
const Page = require('./page');

class LoginPage extends Page {
    /**
     * Define selectors using getter methods
     */
    get inputUsername() {
        return $('input[name="username"]');
    }

    get inputPassword() {
        return $('input[name="password"]');
    }

    get buttonSubmit() {
        return $('button[type="submit"]');
    }

    get passwordToggle() {
        return $('.password-toggle, [data-testid="password-toggle"]');
    }

    get forgotPasswordLink() {
        return $('a[href="/forgot-password"], a:contains("Forgot Password")');
    }

    get errorMessage() {
        return $('.error-message, .flash-message, .alert-danger');
    }

    /**
     * Login with username and password
     * @param {string} username - Username
     * @param {string} password - Password
     */
    async login(username, password) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.buttonSubmit.click();
    }

    /**
     * Submit the login form without filling fields
     */
    async submitForm() {
        await this.buttonSubmit.click();
    }

    /**
     * Get error message text
     * @returns {Promise<string>} Error message text
     */
    async getErrorMessage() {
        await this.errorMessage.waitForDisplayed();
        return await this.errorMessage.getText();
    }

    /**
     * Open login page
     */
    async open() {
        await super.open('/login');
    }
}

module.exports = new LoginPage();
