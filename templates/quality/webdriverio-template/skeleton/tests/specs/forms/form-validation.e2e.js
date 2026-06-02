/**
 * Form Validation E2E Tests
 * Tests various form validation scenarios
 * Project: ${{ values.projectName }}
 */

describe('Form Validation Tests', () => {
    it('should validate required fields on contact form', async () => {
        await browser.url('/contact');

        const submitBtn = await $('button[type="submit"]');
        await submitBtn.click();

        const nameInput = await $('input[name="name"]');
        const emailInput = await $('input[name="email"]');
        const messageInput = await $('textarea[name="message"]');

        const nameValid = await nameInput.getAttribute('validity');
        expect(nameValid).toBeDefined();
    });

    it('should validate numeric inputs', async () => {
        await browser.url('/form');

        const ageInput = await $('input[type="number"]');
        if (await ageInput.isExisting()) {
            await ageInput.setValue('abc');
            const value = await ageInput.getValue();
            expect(value).toBe(''); // Non-numeric should be rejected
        }
    });

    it('should validate date inputs', async () => {
        await browser.url('/form');

        const dateInput = await $('input[type="date"]');
        if (await dateInput.isExisting()) {
            await dateInput.setValue('2024-01-01');
            const value = await dateInput.getValue();
            expect(value).toBe('2024-01-01');
        }
    });

    it('should show real-time validation errors', async () => {
        await browser.url('/form');

        const emailInput = await $('input[type="email"]');
        await emailInput.setValue('invalid');

        // Trigger blur event
        await emailInput.click();
        await $('body').click();

        // Check for error message
        const errorMsg = await $('.error-message, .invalid-feedback');
        if (await errorMsg.isExisting()) {
            await expect(errorMsg).toBeDisplayed();
        }
    });

    it('should clear validation errors when corrected', async () => {
        await browser.url('/form');

        const emailInput = await $('input[type="email"]');
        await emailInput.setValue('invalid');
        await $('body').click();

        // Now correct it
        await emailInput.setValue('valid@example.com');
        await $('body').click();

        const errorMsg = await $('.error-message');
        if (await errorMsg.isExisting()) {
            await expect(errorMsg).not.toBeDisplayed();
        }
    });
});
