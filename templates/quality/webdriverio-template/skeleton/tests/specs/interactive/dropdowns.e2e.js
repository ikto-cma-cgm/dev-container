/**
 * Dropdown E2E Tests
 * Tests dropdown/select interactions
 * Project: ${{ values.projectName }}
 */

describe('Dropdown Tests', () => {
    beforeEach(async () => {
        await browser.url('/form');
    });

    it('should select option from native dropdown', async () => {
        const countrySelect = await $('select[name="country"]');
        if (await countrySelect.isExisting()) {
            await countrySelect.selectByVisibleText('United States');
            const value = await countrySelect.getValue();
            expect(value).toBe('US');
        }
    });

    it('should select option from custom dropdown', async () => {
        const customDropdown = await $('[data-testid="custom-dropdown"]');
        if (await customDropdown.isExisting()) {
            await customDropdown.click();

            const option = await $('[data-value="option1"]');
            await option.click();

            const selectedText = await customDropdown.getText();
            expect(selectedText).toContain('Option 1');
        }
    });

    it('should filter dropdown options by typing', async () => {
        const searchableDropdown = await $('[data-testid="searchable-dropdown"]');
        if (await searchableDropdown.isExisting()) {
            await searchableDropdown.click();

            const searchInput = await $('input[placeholder*="Search"]');
            await searchInput.setValue('test');

            const options = await $$('[role="option"]');
            expect(options.length).toBeGreaterThan(0);

            const firstOption = await options[0].getText();
            expect(firstOption.toLowerCase()).toContain('test');
        }
    });

    it('should support multi-select dropdown', async () => {
        const multiSelect = await $('select[multiple]');
        if (await multiSelect.isExisting()) {
            await multiSelect.selectByIndex(0);
            await multiSelect.selectByIndex(1);

            const selected = await multiSelect.$$('option:checked');
            expect(selected.length).toBe(2);
        }
    });

    it('should clear selected option', async () => {
        const dropdown = await $('[data-testid="clearable-dropdown"]');
        if (await dropdown.isExisting()) {
            await dropdown.click();
            await $('[data-value="option1"]').click();

            const clearBtn = await $('[data-testid="clear-button"]');
            await clearBtn.click();

            const value = await dropdown.getAttribute('data-value');
            expect(value).toBeFalsy();
        }
    });
});
