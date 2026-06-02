# WebdriverIO Best Practices

This document outlines best practices for writing effective and maintainable WebdriverIO tests.

## ?? Test Structure

### 1. Page Object Pattern
Always use Page Objects to encapsulate page elements and actions:

```javascript
// Good
const LoginPage = require('../pageobjects/login.page');

describe('Login', () => {
    it('should login successfully', async () => {
        await LoginPage.open();
        await LoginPage.login('user', 'pass');
        await expect(browser).toHaveUrl('/dashboard');
    });
});

// Page Object file (login.page.js)
class LoginPage {
    get usernameInput() { return $('#username'); }
    get passwordInput() { return $('#password'); }
    get loginButton() { return $('#login-button'); }
    
    async open() {
        await browser.url('/login');
    }
    
    async login(username, password) {
        await this.usernameInput.setValue(username);
        await this.passwordInput.setValue(password);
        await this.loginButton.click();
    }
}

module.exports = new LoginPage();
```

### 2. Descriptive Test Names
Use clear, descriptive names for tests:

```javascript
// Good
it('should display error message when password is too short', async () => {
    // test logic
});

// Avoid
it('should work', async () => {
    // test logic
});
```

### 3. Proper Assertions
Use appropriate assertions for different scenarios:

```javascript
// For visibility
await expect(element).toBeDisplayed();
await expect(element).not.toBeDisplayed();

// For text content
await expect(element).toHaveText('Expected text');
await expect(element).toHaveTextContaining('partial text');

// For URL
await expect(browser).toHaveUrl('https://example.com');
await expect(browser).toHaveUrlContaining('/login');

// For element properties
await expect(element).toHaveAttribute('class', 'active');
await expect(element).toHaveCSS('color', 'rgb(255, 0, 0)');
```

## ? Test Categories Best Practices

### Form Tests
- Validate all form fields with appropriate data types
- Test both valid and invalid inputs
- Check for proper error messages and validation states
- Test form submission and success states

### Navigation Tests
- Test all navigation paths through the application
- Verify URL changes and page loads
- Test browser history (back/forward buttons)
- Check for proper 404 handling

### Interactive Elements
#### Modals
- Test modal opening and closing behavior
- Verify focus trapping
- Test backdrop clicks and ESC key functionality
- Check modal content and interactions

#### Dropdowns
- Test dropdown opening and closing
- Verify selection behavior
- Test multi-select and searchable dropdowns
- Check dropdown accessibility

#### Tabs
- Test tab switching functionality
- Verify content preservation
- Test keyboard navigation
- Check tab states and active indicators

#### Accordions
- Test accordion open/close behavior
- Verify keyboard navigation support
- Check nested elements handling
- Test multiple accordion interaction

#### Tooltips
- Test tooltip display on hover
- Verify tooltip text content
- Test keyboard navigation support
- Check custom positioning and delays

## ? Performance Optimization

### 1. Efficient Selectors
Use efficient CSS selectors:
```javascript
// Good
await $('#username');  // ID selector (fastest)
await $('.button');     // Class selector
await $('button');      // Tag selector

// Avoid (slow)
await $('div.button');  // Unnecessary tag
await $('//button[@id="submit"]');  // XPath (slower than CSS)
```

### 2. Wait Strategies
Use appropriate waits:
```javascript
// Good - wait for element to be displayed
await expect(element).toBeDisplayed();

// Good - wait for element to be clickable
await element.waitForClickable();

// Good - wait for URL to change
await expect(browser).toHaveUrlContaining('/dashboard');
```

### 3. Test Parallelization
Configure parallel execution properly:
```javascript
// In wdio.conf.js
exports.config = {
    maxInstances: 5,
    capabilities: [{
        maxInstances: 2,  // Per browser
        browserName: 'chrome'
    }]
};
```

## ?? Error Handling

### 1. Robust Test Code
Handle potential errors gracefully:
```javascript
it('should handle network errors', async () => {
    try {
        await browser.url('/slow-page');
        await expect(element).toBeDisplayed();
    } catch (error) {
        // Handle expected error
        expect(error.message).toContain('timeout');
    }
});
```

### 2. Retry Logic
Implement retry logic for flaky tests:
```javascript
it('should handle flaky test', async () => {
    await retry(async () => {
        await browser.url('/page');
        await expect(element).toBeDisplayed();
    }, { retries: 3, delay: 1000 });
});
```

## ? Reporting and Debugging

### 1. Screenshots and Videos
Enable screenshots on failures:
```javascript
// In wdio.conf.js
exports.config = {
    reporters: [
        ['allure', { outputDir: 'allure-results' }],
        ['spec', { 
            addConsoleLogs: true,
            showFailures: true
        }]
    ]
};
```

### 2. Debugging
Use browser debugging capabilities:
```javascript
it('should debug test', async () => {
    await browser.debug();  // Pause execution
    // Test code here
});
```

## ? CI/CD Integration

### 1. Test Configuration
Set up appropriate test environments:
```bash
# Run tests with different configurations
BASE_URL=https://staging.example.com npm run test:e2e
HEADLESS=false npm run test:e2e
```

### 2. Artifact Management
Configure artifact upload for CI/CD:
```yaml
# In .github/workflows/webdriverio.yml
- name: Upload Test Results
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: test-results/
```

## ? Maintenance

### 1. Regular Updates
Keep dependencies updated:
```bash
npm update webdriverio
npm update @wdio/cli
```

### 2. Code Reviews
Review test code for:
- Readability
- Maintainability
- Performance
- Coverage

## ? Resources

- [WebdriverIO Documentation](https://webdriver.io/docs/)
- [Page Object Pattern](https://webdriver.io/docs/pageobjects)
- [Best Practices Guide](https://webdriver.io/docs/best-practices)
