const Page = require('./page');

/**
 * Navigation Page Object
 * Represents navigation menu and interactions
 */
class NavigationPage extends Page {
    /**
     * Define page elements
     */
    get hamburgerMenu() {
        return $('button.hamburger, button[aria-label="Menu"]');
    }

    get mobileMenu() {
        return $('nav.mobile-menu, [data-mobile-menu]');
    }

    get breadcrumbs() {
        return $('nav[aria-label="Breadcrumb"], .breadcrumbs');
    }

    /**
     * Click navigation link by text
     * @param {string} linkText - Link text to click
     */
    async clickNavLink(linkText) {
        const link = await $(`nav a*=${linkText}`);
        await this.clickElement(link);
    }

    /**
     * Get active navigation link
     * @returns {Promise<WebdriverIO.Element>} Active link element
     */
    async getActiveNavLink() {
        return await $('nav a.active, nav a[aria-current="page"]');
    }

    /**
     * Click mobile navigation link
     * @param {string} linkText - Link text to click
     */
    async clickMobileNavLink(linkText) {
        const link = await this.mobileMenu.$(`a*=${linkText}`);
        await this.clickElement(link);
    }

    /**
     * Get dropdown menu element
     * @param {string} menuText - Menu text
     * @returns {Promise<WebdriverIO.Element>} Dropdown menu element
     */
    async getDropdownMenu(menuText) {
        return await $(`nav [data-dropdown="${menuText}"], nav button*=${menuText}`);
    }

    /**
     * Get dropdown content element
     * @param {string} menuText - Menu text
     * @returns {Promise<WebdriverIO.Element>} Dropdown content element
     */
    async getDropdownContent(menuText) {
        return await $(`[data-dropdown-content="${menuText}"], [aria-labelledby*="${menuText}"]`);
    }

    /**
     * Click dropdown item
     * @param {string} menuText - Dropdown menu text
     * @param {string} itemText - Item text to click
     */
    async clickDropdownItem(menuText, itemText) {
        await this.getDropdownMenu(menuText).moveTo();
        const item = await $(`a*=${itemText}`);
        await this.clickElement(item);
    }

    /**
     * Toggle mobile menu
     */
    async toggleMobileMenu() {
        await this.clickElement(this.hamburgerMenu);
        await browser.pause(500); // Wait for animation
    }

    /**
     * Navigate using breadcrumbs
     * @param {string} breadcrumbText - Breadcrumb text to click
     */
    async clickBreadcrumb(breadcrumbText) {
        const breadcrumb = await this.breadcrumbs.$(`a*=${breadcrumbText}`);
        await this.clickElement(breadcrumb);
    }
}

module.exports = new NavigationPage();
