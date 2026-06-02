const Page = require('./page');

/**
 * Login Page Object
 * Represents the login page of the application
 */
class LoginPage extends Page {
    /**
     * Define page elements
     */
    get inputUsername() {
        return $('input[name="username"]');
    }

    get inputPassword() {
        return $('input[name="password"]');
    }

    get btnSubmit() {
        return $('button[type="submit"]');
    }

    get flashMessage() {
        return $('.flash-message');
    }

    /**
     * Perform login action
     * @param {string} username - Username
     * @param {string} password - Password
     */
    async login(username, password) {
        await this.setValue(this.inputUsername, username);
        await this.setValue(this.inputPassword, password);
        await this.clickElement(this.btnSubmit);
    }

    /**
     * Open login page
     */
    async open() {
        await super.open('/login');
    }

    /**
     * Get flash message text
     * @returns {Promise<string>} Flash message text
     */
    async getFlashMessageText() {
        await this.waitForDisplayed(this.flashMessage);
        return await this.flashMessage.getText();
    }
}

module.exports = new LoginPage();
