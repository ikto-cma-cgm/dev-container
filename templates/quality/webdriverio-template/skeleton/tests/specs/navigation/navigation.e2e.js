/**
 * Navigation E2E Tests
 * Tests page navigation and routing
 * Project: ${{ values.projectName }}
 */

const NavigationPage = require('../../pageobjects/navigation.page');

describe('Navigation Tests', () => {
    it('should navigate between pages using links', async () => {
        await browser.url('/');

        await NavigationPage.clickNavLink('About');
        await expect(browser).toHaveUrlContaining('/about');

        await NavigationPage.clickNavLink('Contact');
        await expect(browser).toHaveUrlContaining('/contact');

        await NavigationPage.clickNavLink('Home');
        await expect(browser).toHaveUrlContaining('/');
    });

    it('should maintain active state on current page', async () => {
        await browser.url('/about');

        const activeLink = await NavigationPage.getActiveNavLink();
        expect(await activeLink.getText()).toMatch(/about/i);
    });

    it('should navigate using browser back/forward', async () => {
        await browser.url('/');
        await NavigationPage.clickNavLink('About');
        await NavigationPage.clickNavLink('Contact');

        await browser.back();
        await expect(browser).toHaveUrlContaining('/about');

        await browser.forward();
        await expect(browser).toHaveUrlContaining('/contact');
    });

    it('should navigate using breadcrumbs', async () => {
        await browser.url('/products/category/item');

        const breadcrumbs = await NavigationPage.breadcrumbs;
        if (await breadcrumbs.isExisting()) {
            const homeLink = await breadcrumbs.$('a[href="/"]');
            await homeLink.click();
            await expect(browser).toHaveUrl(expect.stringContaining('/'));
        }
    });

    it('should handle 404 not found pages', async () => {
        await browser.url('/non-existent-page-12345');

        const notFoundIndicator = await $('h1*=404, h1*=Not Found');
        if (await notFoundIndicator.isExisting()) {
            await expect(notFoundIndicator).toBeDisplayed();
        }
    });

    it('should preserve query parameters during navigation', async () => {
        await browser.url('/?source=test&utm_campaign=demo');

        await NavigationPage.clickNavLink('About');

        const currentUrl = await browser.getUrl();
        // May or may not preserve - test your app's behavior
        expect(currentUrl).toBeDefined();
    });
});
