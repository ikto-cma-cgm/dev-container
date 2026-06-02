/**
 * Tooltip Component Tests
 * Project: ${{ values.projectName }}
 * Test Type: ${{ values.testType }}
 * Framework: ${{ values.testFramework }}
 */

const LoginPage = require('../../pageobjects/login.page');

describe('${{ values.projectName }} - Tooltip Component Tests', () => {

    beforeEach(async () => {
        await browser.url('/');
    });

    it('should display tooltip on hover', async () => {
        await browser.url('/components/tooltip');
        
        const tooltipTrigger = await $('.tooltip-trigger');
        const tooltip = await $('.tooltip');
        
        // Initially tooltip should be hidden
        await expect(tooltip).not.toBeDisplayed();
        
        // Hover over trigger
        await tooltipTrigger.moveToElement();
        
        // Tooltip should be displayed
        await expect(tooltip).toBeDisplayed();
    });

    it('should hide tooltip when mouse leaves', async () => {
        await browser.url('/components/tooltip');
        
        const tooltipTrigger = await $('.tooltip-trigger');
        const tooltip = await $('.tooltip');
        
        // Hover over trigger
        await tooltipTrigger.moveToElement();
        await expect(tooltip).toBeDisplayed();
        
        // Move away from trigger
        await browser.moveToElement('.container', 0, 0);
        
        // Tooltip should be hidden
        await expect(tooltip).not.toBeDisplayed();
    });

    it('should display correct tooltip text', async () => {
        await browser.url('/components/tooltip');
        
        const tooltipTrigger = await $('.tooltip-trigger');
        const tooltip = await $('.tooltip');
        
        // Hover over trigger
        await tooltipTrigger.moveToElement();
        
        const tooltipText = await tooltip.getText();
        expect(tooltipText).toBeDefined();
        expect(tooltipText.length).toBeGreaterThan(0);
        expect(tooltipText).toContain('Helpful information');
    });

    it('should handle multiple tooltips', async () => {
        await browser.url('/components/tooltip');
        
        const firstTrigger = await $('.tooltip-trigger:first-child');
        const secondTrigger = await $('.tooltip-trigger:nth-child(2)');
        const firstTooltip = await $('.tooltip:first-child');
        const secondTooltip = await $('.tooltip:nth-child(2)');
        
        // First tooltip
        await firstTrigger.moveToElement();
        await expect(firstTooltip).toBeDisplayed();
        await expect(secondTooltip).not.toBeDisplayed();
        
        // Second tooltip
        await secondTrigger.moveToElement();
        await expect(firstTooltip).not.toBeDisplayed();
        await expect(secondTooltip).toBeDisplayed();
    });

    it('should handle keyboard navigation for tooltips', async () => {
        await browser.url('/components/tooltip');
        
        const tooltipTrigger = await $('.tooltip-trigger');
        await tooltipTrigger.moveToElement();
        
        // Press tab key
        await browser.keys('Tab');
        
        // Tooltip should still be visible
        await expect(tooltipTrigger).toBeDisplayed();
    });

    it('should handle tooltip with custom positioning', async () => {
        await browser.url('/components/tooltip');
        
        const positionedTooltip = await $('.tooltip.positioned');
        const positionedTrigger = await $('.tooltip-trigger.positioned');
        
        await positionedTrigger.moveToElement();
        
        // Should be displayed
        await expect(positionedTooltip).toBeDisplayed();
        
        // Check positioning
        const position = await positionedTooltip.getCSSProperty('position');
        expect(position.value).toBe('absolute');
    });

    it('should handle tooltip with delay', async () => {
        await browser.url('/components/tooltip');
        
        const delayedTrigger = await $('.tooltip-trigger.delayed');
        const tooltip = await $('.tooltip.delayed');
        
        // Should not show immediately
        await delayedTrigger.moveToElement();
        await expect(tooltip).not.toBeDisplayed();
        
        // Wait for delay to pass
        await browser.pause(1000);
        
        // Tooltip should now be displayed
        await expect(tooltip).toBeDisplayed();
    });
});


# task_progress RECOMMENDED

When starting a new task, it is recommended to include a todo list using the task_progress parameter.


1. Include a todo list using the task_progress parameter in your next tool call
2. Create a comprehensive checklist of all steps needed
3. Use markdown format: - [ ] for incomplete, - [x] for complete

**Benefits of creating a todo/task_progress list now:**
	- Clear roadmap for implementation
	- Progress tracking throughout the task
	- Nothing gets forgotten or missed
	- Users can see, monitor, and edit the plan

**Example structure:**```
- [ ] Analyze requirements
- [ ] Set up necessary files
- [ ] Implement main functionality
- [ ] Handle edge cases
- [ ] Test the implementation
- [ ] Verify results```

Keeping the task_progress list updated helps track progress and ensures nothing is missed.

<environment_details>
# IntelliJ IDEA Ultimate Visible Files
templates/quality/webdriverio-template/skeleton/tests/specs/interactive/accordions.e2e.js

# IntelliJ IDEA Ultimate Open Tabs
.gitignore
.env
templates/quality/webdriverio-template/template.yaml
templates/quality/webdriverio-template/skeleton/tests/specs/interactive/accordions.e2e.js

# Current Time
1/8/2026, 5:28:04 PM (Europe/Paris, UTC+1:00)

# Context Window Usage
32,920 / 64K tokens used (51%)

# Current Mode
ACT MODE
</environment_details>
