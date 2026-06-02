/**
 * Menu Navigation E2E Tests
 * Tests menu interactions (dropdowns, hamburger, etc.)
 * Project: ${{ values.projectName }}
 */

const NavigationPage = require('../../pageobjects/navigation.page');

describe('Menu Navigation Tests', () => {
    it('should open and close mobile hamburger menu', async () => {
        await browser.url('/');
        await browser.setWindowSize(375, 667); // Mobile size

        const hamburgerBtn = await NavigationPage.hamburgerMenu;
        if (await hamburgerBtn.isExisting()) {
            await hamburgerBtn.click();
            await expect(NavigationPage.mobileMenu).toBeDisplayed();

            await hamburgerBtn.click();
            await expect(NavigationPage.mobileMenu).not.toBeDisplayed();
        }
    });

    it('should navigate using mobile menu', async () => {
        await browser.url('/');
        await browser.setWindowSize(375, 667);

        const hamburgerBtn = await NavigationPage.hamburgerMenu;
        if (await hamburgerBtn.isExisting()) {
            await hamburgerBtn.click();
            await NavigationPage.clickMobileNavLink('About');
            await expect(browser).toHaveUrlContaining('/about');
        }
    });

    it('should display dropdown menu on hover', async () => {
        await browser.url('/');
        await browser.setWindowSize(1920, 1080); // Desktop

        const productsMenu = await NavigationPage.getDropdownMenu('Products');
        if (await productsMenu.isExisting()) {
            await productsMenu.moveTo();
            const dropdown = await NavigationPage.getDropdownContent('Products');
            await expect(dropdown).toBeDisplayed();
        }
    });

    it('should navigate using dropdown menu items', async () => {
        await browser.url('/');
        await browser.setWindowSize(1920, 1080);

        const productsMenu = await NavigationPage.getDropdownMenu('Products');
        if (await productsMenu.isExisting()) {
            await productsMenu.moveTo();
            await NavigationPage.clickDropdownItem('Products', 'Electronics');
            await expect(browser).toHaveUrlContaining('/products/electronics');
        }
    });

    it('should close dropdown when clicking outside', async () => {
        await browser.url('/');
        await browser.setWindowSize(1920, 1080);

        const productsMenu = await NavigationPage.getDropdownMenu('Products');
        if (await productsMenu.isExisting()) {
            await productsMenu.click();
            await $('body').click();

            const dropdown = await NavigationPage.getDropdownContent('Products');
            await expect(dropdown).not.toBeDisplayed();
        }
    });

    it('should support keyboard navigation in menu', async () => {
        await browser.url('/');

        const firstLink = await $('nav a:first-child');
        await firstLink.click();

        // Tab through menu items
        await browser.keys(['Tab']);
        const focusedElement = await browser.execute(() => document.activeElement.tagName);
        expect(focusedElement).toBe('A');
    });
});
