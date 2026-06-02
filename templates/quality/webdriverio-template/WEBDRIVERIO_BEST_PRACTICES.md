# WebdriverIO Testing Best Practices

This document outlines best practices for writing and maintaining WebdriverIO tests.

## Test Design Principles

### 1. Use Page Object Model (POM)

**Why**: Improves maintainability, reduces duplication, and makes tests more readable.

**Good**:
```javascript
const LoginPage = require('../pageobjects/login.page');

it('should login successfully', async () => {
    await LoginPage.open();
    await LoginPage.login('user', 'pass');
    await expect(browser).toHaveUrl('/dashboard');
});
```

**Bad**:
```javascript
it('should login successfully', async () => {
    await browser.url('/login');
    await $('input[name="username"]').setValue('user');
    await $('input[name="password"]').setValue('pass');
    await $('button[type="submit"]').click();
});
```

### 2. Keep Tests Independent

**Why**: Tests should not depend on each other. Each test should be able to run in isolation.

**Good**:
```javascript
describe('User Profile', () => {
    beforeEach(async () => {
        await LoginPage.open();
        await LoginPage.login('testuser', 'password');
    });

    it('should update profile', async () => {
        // Test implementation
    });

    it('should change password', async () => {
        // Test implementation
    });
});
```

**Bad**:
```javascript
describe('User Flow', () => {
    it('should login', async () => {
        await LoginPage.login('user', 'pass');
    });

    it('should update profile', async () => {
        // Depends on previous test
    });
});
```

### 3. Use Explicit Waits

**Why**: Explicit waits are more reliable than implicit waits or sleep().

**Good**:
```javascript
await element.waitForDisplayed({ timeout: 5000 });
await element.click();
```

**Bad**:
```javascript
await browser.pause(3000);  // Arbitrary wait
await element.click();
```

### 4. Use Meaningful Selectors

**Why**: Robust selectors make tests more maintainable and less brittle.

**Good**:
```javascript
// Data attributes
await $('[data-testid="login-button"]').click();

// Semantic selectors
await $('button[type="submit"]').click();
```

**Bad**:
```javascript
// Fragile CSS selectors
await $('.container > div:nth-child(2) > button').click();

// XPath with complex paths
await $('//div[3]/div[1]/button[2]').click();
```

### 5. Handle Dynamic Content

**Why**: Modern web apps load content dynamically.

**Good**:
```javascript
await browser.waitUntil(
    async () => {
        const items = await $$('.list-item');
        return items.length > 0;
    },
    {
        timeout: 10000,
        timeoutMsg: 'List items did not load'
    }
);
```

**Bad**:
```javascript
await browser.pause(5000);
const items = await $$('.list-item');
```

## Test Organization

### 6. Group Related Tests

```javascript
describe('User Authentication', () => {
    describe('Login', () => {
        it('should login with valid credentials', async () => {});
        it('should show error with invalid credentials', async () => {});
    });

    describe('Logout', () => {
        it('should logout successfully', async () => {});
    });
});
```

### 7. Use Descriptive Test Names

**Good**:
```javascript
it('should display error message when username is empty', async () => {});
it('should redirect to dashboard after successful login', async () => {});
```

**Bad**:
```javascript
it('test1', async () => {});
it('login test', async () => {});
```

### 8. Setup and Teardown

```javascript
describe('User Profile Tests', () => {
    before(async () => {
        // Run once before all tests
        await setupTestData();
    });

    beforeEach(async () => {
        // Run before each test
        await LoginPage.login('testuser', 'password');
    });

    afterEach(async () => {
        // Run after each test
        await cleanupSession();
    });

    after(async () => {
        // Run once after all tests
        await cleanupTestData();
    });
});
```

## Performance Optimization

### 9. Parallelize Tests

```javascript
// wdio.conf.js
exports.config = {
    maxInstances: 5,  // Run up to 5 tests in parallel
    capabilities: [
        {
            browserName: 'chrome',
            maxInstances: 5
        }
    ]
};
```

### 10. Optimize Waits

```javascript
// Set appropriate timeouts
exports.config = {
    waitforTimeout: 10000,  // Default wait timeout
    connectionRetryTimeout: 120000  // Connection timeout
};
```

### 11. Reuse Browser Sessions

```javascript
// For related tests that don't need isolation
describe('Dashboard Tests', () => {
    before(async () => {
        await LoginPage.login('user', 'pass');
    });

    // Multiple tests reuse the same session
    it('should display widgets', async () => {});
    it('should allow widget customization', async () => {});
});
```

## Error Handling

### 12. Take Screenshots on Failure

```javascript
afterEach(async function() {
    if (this.currentTest.state === 'failed') {
        const testName = this.currentTest.title.replace(/\s+/g, '_');
        await browser.saveScreenshot(`./screenshots/${testName}.png`);
    }
});
```

### 13. Add Custom Error Messages

```javascript
await expect(element).toBeDisplayed({
    message: 'Login button should be visible on the page'
});
```

### 14. Retry Flaky Tests

```javascript
// wdio.conf.js
exports.config = {
    mochaOpts: {
        retries: 2  // Retry failed tests up to 2 times
    }
};
```

## Data Management

### 15. Externalize Test Data

```javascript
// test-data.js
module.exports = {
    users: {
        valid: {
            username: 'testuser',
            password: 'testpass'
        }
    }
};

// test.js
const testData = require('../helpers/test-data');
await LoginPage.login(testData.users.valid.username, testData.users.valid.password);
```

### 16. Use Environment Variables

```javascript
// Access environment-specific data
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const apiKey = process.env.API_KEY;
```

### 17. Generate Dynamic Data

```javascript
const uniqueEmail = `test.user.${Date.now()}@example.com`;
const randomUsername = `user_${Math.random().toString(36).substring(7)}`;
```

## Assertions

### 18. Use Appropriate Assertions

```javascript
// Element assertions
await expect(element).toBeDisplayed();
await expect(element).toHaveText('Expected Text');
await expect(element).toHaveAttribute('class', 'active');

// URL assertions
await expect(browser).toHaveUrl('https://example.com/dashboard');
await expect(browser).toHaveUrlContaining('/dashboard');

// Title assertions
await expect(browser).toHaveTitle('Dashboard');
```

### 19. Multiple Assertions

```javascript
it('should display user information', async () => {
    await expect(usernameElement).toBeDisplayed();
    await expect(usernameElement).toHaveText('John Doe');
    await expect(emailElement).toBeDisplayed();
    await expect(emailElement).toHaveText('john@example.com');
});
```

## CI/CD Integration

### 20. Run in Headless Mode

```javascript
// wdio.conf.js - CI environment
const isCI = process.env.CI === 'true';

capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
        args: isCI ? ['--headless', '--disable-gpu'] : []
    }
}]
```

### 21. Generate Reports for CI

```javascript
// Use multiple reporters
reporters: [
    'spec',  // Console output
    ['junit', {  // For CI integration
        outputDir: './test-results',
        outputFileFormat: function(options) {
            return `results.xml`;
        }
    }],
    ['allure', {  // Rich HTML reports
        outputDir: 'allure-results'
    }]
]
```

### 22. Handle Test Artifacts

```yaml
# GitHub Actions
- name: Upload screenshots
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: test-screenshots
    path: test-results/screenshots/
```

## Security

### 23. Protect Sensitive Data

```javascript
// Use environment variables for credentials
const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;

// Never commit credentials
// Add to .gitignore: .env, credentials.json
```

### 24. Use Secrets in CI

```yaml
# GitHub Actions
env:
  TEST_USERNAME: ${{ secrets.TEST_USERNAME }}
  TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

## Debugging

### 25. Use Debug Mode

```bash
# Run with debug output
DEBUG=true npm run test:e2e
```

```javascript
// Add debug pauses in tests
await browser.debug();  // Opens REPL for debugging
```

### 26. Verbose Logging

```javascript
// wdio.conf.js
exports.config = {
    logLevel: 'debug',  // trace | debug | info | warn | error | silent
};
```

### 27. Browser Developer Tools

```javascript
// Access browser console logs
const logs = await browser.getLogs('browser');
console.log(logs);
```

## Maintenance

### 28. Regular Updates

```bash
# Update WebdriverIO and dependencies
npm update @wdio/cli @wdio/local-runner

# Check for outdated packages
npm outdated
```

### 29. Review and Refactor

- Regularly review test code for duplication
- Refactor common patterns into helpers
- Update selectors when UI changes
- Remove obsolete tests

### 30. Monitor Test Health

- Track flaky tests and fix them
- Monitor test execution times
- Review test failure trends
- Keep test coverage metrics

## Common Pitfalls to Avoid

### ❌ Don't Use Hard-Coded Waits

```javascript
// Bad
await browser.pause(3000);

// Good
await element.waitForDisplayed({ timeout: 5000 });
```

### ❌ Don't Test Third-Party Integrations

Focus on your application logic, not external services.

### ❌ Don't Over-Test

Test user workflows, not implementation details.

### ❌ Don't Ignore Flaky Tests

Fix them or remove them - flaky tests erode confidence.

### ❌ Don't Skip Code Reviews for Tests

Test code quality matters as much as application code.

## Resources

- [WebdriverIO Official Best Practices](https://webdriver.io/docs/bestpractices)
- [Selenium Best Practices](https://www.selenium.dev/documentation/test_practices/)
- [Page Object Pattern](https://martinfowler.com/bliki/PageObject.html)
