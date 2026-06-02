/**
 * Base Page Object
 * Contains common methods shared across all page objects
 * Note: This file is generated even if Page Objects are not explicitly requested
 */
class Page {
    /**
     * Open a sub-page on the base URL
     * @param {string} path - Path to navigate to
     */
    async open(path) {
        await browser.url(path);
    }

    /**
     * Wait for an element to be displayed
     * @param {WebdriverIO.Element} element - Element to wait for
     * @param {number} timeout - Timeout in milliseconds
     */
    async waitForDisplayed(element, timeout = 10000) {
        await element.waitForDisplayed({ timeout });
    }

    /**
     * Wait for an element to be clickable
     * @param {WebdriverIO.Element} element - Element to wait for
     * @param {number} timeout - Timeout in milliseconds
     */
    async waitForClickable(element, timeout = 10000) {
        await element.waitForClickable({ timeout });
    }

    /**
     * Get the current page title
     * @returns {Promise<string>} Page title
     */
    async getTitle() {
        return await browser.getTitle();
    }

    /**
     * Take a screenshot
     * @param {string} filename - Screenshot filename
     */
    async takeScreenshot(filename) {
        await browser.saveScreenshot(`./test-results/screenshots/${filename}.png`);
    }

    /**
     * Scroll to an element
     * @param {WebdriverIO.Element} element - Element to scroll to
     */
    async scrollToElement(element) {
        await element.scrollIntoView();
    }

    /**
     * Wait for page to load
     * @param {string} state - Document ready state (default: 'complete')
     */
    async waitForPageLoad(state = 'complete') {
        await browser.waitUntil(
            async () => await browser.execute(() => document.readyState) === state,
            {
                timeout: 60000,
                timeoutMsg: `Page did not load within 60 seconds (expected state: ${state})`
            }
        );
    }

    /**
     * Check if element is displayed
     * @param {WebdriverIO.Element} element - Element to check
     * @returns {Promise<boolean>} True if displayed
     */
    async isDisplayed(element) {
        try {
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Clear and set value for an input field
     * @param {WebdriverIO.Element} element - Input element
     * @param {string} value - Value to set
     */
    async setValue(element, value) {
        await this.waitForDisplayed(element);
        await element.clearValue();
        await element.setValue(value);
    }

    /**
     * Click on an element with wait
     * @param {WebdriverIO.Element} element - Element to click
     */
    async clickElement(element) {
        await this.waitForClickable(element);
        await element.click();
    }
}

module.exports = Page;
