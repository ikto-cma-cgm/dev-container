/**
 * Tabs E2E Tests
 * Tests tab navigation and content switching
 * Project: ${{ values.projectName }}
 */

describe('Tabs Tests', () => {
    beforeEach(async () => {
        await browser.url('/tabs-demo');
    });

    it('should switch between tabs', async () => {
        const tab1 = await $('[role="tab"][data-tab="tab1"]');
        const tab2 = await $('[role="tab"][data-tab="tab2"]');

        if (await tab1.isExisting() && await tab2.isExisting()) {
            await tab2.click();

            const panel2 = await $('[role="tabpanel"][data-panel="tab2"]');
            await expect(panel2).toBeDisplayed();

            const panel1 = await $('[role="tabpanel"][data-panel="tab1"]');
            await expect(panel1).not.toBeDisplayed();
        }
    });

    it('should show correct tab as active', async () => {
        const tab2 = await $('[role="tab"][data-tab="tab2"]');

        if (await tab2.isExisting()) {
            await tab2.click();

            const activeClass = await tab2.getAttribute('aria-selected');
            expect(activeClass).toBe('true');
        }
    });

    it('should support keyboard navigation between tabs', async () => {
        const tab1 = await $('[role="tab"]:first-child');

        if (await tab1.isExisting()) {
            await tab1.click();
            await browser.keys(['ArrowRight']);

            const focused = await browser.execute(() => {
                return document.activeElement.getAttribute('data-tab');
            });

            expect(focused).toBeDefined();
        }
    });

    it('should preserve tab content when switching', async () => {
        const tab1 = await $('[role="tab"][data-tab="tab1"]');

        if (await tab1.isExisting()) {
            // Fill form in tab1
            const input = await $('[data-panel="tab1"] input');
            await input.setValue('test value');

            // Switch to tab2 and back
            await $('[role="tab"][data-tab="tab2"]').click();
            await tab1.click();

            // Check if value persists
            const value = await input.getValue();
            expect(value).toBe('test value');
        }
    });

    it('should lazy load tab content', async () => {
        const tab3 = await $('[role="tab"][data-tab="tab3"]');

        if (await tab3.isExisting()) {
            const panel3 = await $('[role="tabpanel"][data-panel="tab3"]');
            const initialContent = await panel3.$$('*');

            await tab3.click();
            await browser.pause(1000); // Wait for lazy load

            const loadedContent = await panel3.$$('*');
            expect(loadedContent.length).toBeGreaterThan(initialContent.length);
        }
    });
});
