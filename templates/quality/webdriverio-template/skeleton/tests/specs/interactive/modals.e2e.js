/**
 * Modal Dialog E2E Tests
 * Tests modal interactions
 * Project: ${{ values.projectName }}
 */

const ModalPage = require('../../pageobjects/modal.page');

describe('Modal Dialog Tests', () => {
    beforeEach(async () => {
        await browser.url('/');
    });

    it('should open modal when clicking trigger button', async () => {
        await ModalPage.openModal('login');
        await expect(ModalPage.modal).toBeDisplayed();
    });

    it('should close modal when clicking close button', async () => {
        await ModalPage.openModal('login');
        await ModalPage.closeButton.click();
        await expect(ModalPage.modal).not.toBeDisplayed();
    });

    it('should close modal when clicking backdrop', async () => {
        await ModalPage.openModal('login');
        await ModalPage.backdrop.click();
        await expect(ModalPage.modal).not.toBeDisplayed();
    });

    it('should close modal when pressing Escape key', async () => {
        await ModalPage.openModal('login');
        await browser.keys(['Escape']);
        await browser.pause(500); // Wait for animation
        await expect(ModalPage.modal).not.toBeDisplayed();
    });

    it('should trap focus within modal', async () => {
        await ModalPage.openModal('login');

        const firstInput = await ModalPage.modal.$('input:first-child');
        await firstInput.click();

        // Tab through all focusable elements
        for (let i = 0; i < 10; i++) {
            await browser.keys(['Tab']);
        }

        // Focus should still be within modal
        const focused = await browser.execute(() => {
            const modal = document.querySelector('[role="dialog"]');
            return modal && modal.contains(document.activeElement);
        });
        expect(focused).toBe(true);
    });

    it('should prevent body scroll when modal is open', async () => {
        await ModalPage.openModal('login');

        const bodyOverflow = await browser.execute(() => {
            return window.getComputedStyle(document.body).overflow;
        });

        expect(bodyOverflow).toMatch(/hidden|clip/);
    });

    it('should display correct modal content', async () => {
        await ModalPage.openModal('login');
        const title = await ModalPage.getModalTitle();
        expect(title).toBeDefined();
        expect(title.length).toBeGreaterThan(0);
    });
});
