/**
 * Accordion Component Tests
 * Project: ${{ values.projectName }}
 * Test Type: ${{ values.testType }}
 * Framework: ${{ values.testFramework }}
 */

const LoginPage = require('../../pageobjects/login.page');

describe('${{ values.projectName }} - Accordion Component Tests', () => {

    beforeEach(async () => {
        await browser.url('/');
    });

    it('should open accordion on click', async () => {
        await browser.url('/components/accordion');
        
        const accordion = await $('#accordion-example');
        const accordionHeader = await $('.accordion-header');
        const accordionContent = await $('.accordion-content');
        
        // Initially content should be hidden
        await expect(accordionContent).not.toBeDisplayed();
        
        // Click to open
        await accordionHeader.click();
        
        // Content should be displayed
        await expect(accordionContent).toBeDisplayed();
    });

    it('should close accordion when clicked again', async () => {
        await browser.url('/components/accordion');
        
        const accordionHeader = await $('.accordion-header');
        const accordionContent = await $('.accordion-content');
        
        // Open accordion
        await accordionHeader.click();
        await expect(accordionContent).toBeDisplayed();
        
        // Close accordion
        await accordionHeader.click();
        await expect(accordionContent).not.toBeDisplayed();
    });

    it('should handle keyboard navigation', async () => {
        await browser.url('/components/accordion');
        
        const accordionHeader = await $('.accordion-header');
        await accordionHeader.click();
        
        // Test keyboard navigation (arrow keys)
        await browser.keys('ArrowDown');
        await browser.keys('ArrowUp');
        
        // Should still be open
        await expect(accordionHeader).toBeDisplayed();
    });

    it('should handle multiple accordions', async () => {
        await browser.url('/components/accordion');
        
        const firstAccordion = await $('#accordion-1');
        const secondAccordion = await $('#accordion-2');
        const firstContent = await $('#accordion-1-content');
        const secondContent = await $('#accordion-2-content');
        
        // Both should be hidden initially
        await expect(firstContent).not.toBeDisplayed();
        await expect(secondContent).not.toBeDisplayed();
        
        // Open first accordion
        await firstAccordion.click();
        await expect(firstContent).toBeDisplayed();
        await expect(secondContent).not.toBeDisplayed();
        
        // Open second accordion
        await secondAccordion.click();
        await expect(firstContent).not.toBeDisplayed();
        await expect(secondContent).toBeDisplayed();
    });

    it('should validate accordion content', async () => {
        await browser.url('/components/accordion');
        
        const accordionHeader = await $('.accordion-header');
        await accordionHeader.click();
        
        const content = await $('.accordion-content');
        const contentText = await content.getText();
        
        expect(contentText).toBeDefined();
        expect(contentText.length).toBeGreaterThan(0);
    });

    it('should handle accordion with nested elements', async () => {
        await browser.url('/components/accordion');
        
        const accordionHeader = await $('.accordion-header');
        await accordionHeader.click();
        
        const nestedList = await $('.accordion-content ul');
        const nestedItems = await $('.accordion-content li');
        
        await expect(nestedList).toBeDisplayed();
        await expect(nestedItems).toBeDisplayed();
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
templates/quality/webdriverio-template/template.yaml

# IntelliJ IDEA Ultimate Open Tabs
.gitignore
.env
templates/quality/webdriverio-template/template.yaml

# Current Time
1/8/2026, 5:27:26 PM (Europe/Paris, UTC+1:00)

# Context Window Usage
28,796 / 64K tokens used (45%)

# Current Mode
ACT MODE
</environment_details>
