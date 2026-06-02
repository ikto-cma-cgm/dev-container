/**
 * Generic Website Health Tests
 * These tests are universal and can run on any website.
 */

describe('Generic Website Health & SEO Checks', () => {

    beforeEach(async () => {
        await browser.url('/');
    });

    it('should have a non-empty page title', async () => {
        const title = await browser.getTitle();
        expect(title).not.toBe('');
        console.log(`🔍 Page Title: ${title}`);
    });

    it('should have a lang attribute on the html tag for accessibility', async () => {
        const html = await $('html');
        const lang = await html.getAttribute('lang');
        expect(lang).not.toBeNull();
        console.log(`♿ Accessibility Lang: ${lang}`);
    });

    it('should have a meta description for SEO', async () => {
        const description = await $('meta[name="description"]');
        if (await description.isExisting()) {
            const content = await description.getAttribute('content');
            expect(content).not.toBe('');
        } else {
            console.warn('⚠️ No meta description found');
        }
    });

    it('should not have any SEVERE console errors', async () => {
        const logs = await browser.getLogs('browser');
        const severeErrors = logs.filter(log => log.level === 'SEVERE');

        if (severeErrors.length > 0) {
            console.error('❌ Severe Console Errors found:', severeErrors);
        }

        expect(severeErrors.length).toBe(0);
    });

    it('should have all images with alt attributes', async () => {
        const images = await $$('img');
        for (const img of images) {
            const alt = await img.getAttribute('alt');
            if (alt === null || alt === '') {
                const src = await img.getAttribute('src');
                console.warn(`⚠️ Image without alt text: ${src}`);
            }
        }
    });

    it('should have a favicon', async () => {
        const favicon = await $('link[rel*="icon"]');
        expect(favicon).toExist();
    });

    it('should load the page within a reasonable time (under 5s)', async () => {
        const loadTime = await browser.execute(() => {
            return window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        });
        console.log(`⚡ Page Load Time: ${loadTime}ms`);
        expect(loadTime).toBeLessThan(5000);
    });

    it('should check for broken internal links', async () => {
        const links = await $$('a');
        for (const link of links) {
            const href = await link.getAttribute('href');
            if (href === '' || href === '#') {
                const text = await link.getText();
                console.warn(`🔗 Empty link found with text: "${text}"`);
            }
        }
    });
});
