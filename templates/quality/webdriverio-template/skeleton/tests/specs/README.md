# Test Specifications

This directory contains your WebdriverIO test files.

## File Naming Convention

- `*.e2e.js` - End-to-end tests
- `*.component.js` - Component tests
- `*.visual.js` - Visual regression tests
- `*.api.js` - API tests

## Example Test Structure

```javascript
describe('Feature Name', () => {
    beforeEach(async () => {
        // Setup for each test
    });

    it('should perform expected behavior', async () => {
        // Test implementation
        await expect(element).toBeDisplayed();
    });

    afterEach(async () => {
        // Cleanup after each test
    });
});
```

## Writing Good Tests

1. **Use descriptive names**: `it('should display error when username is empty')`
2. **Keep tests independent**: Each test should be able to run in isolation
3. **Use Page Objects**: Avoid hardcoding selectors in tests
4. **Add assertions**: Always verify the expected behavior
5. **Handle async properly**: Use `await` for all WebdriverIO commands

## Running Tests

```bash
# Run all tests
npm run test:e2e

# Run specific test file
npx wdio run wdio-config/wdio.conf.js --spec tests/specs/example.e2e.js

# Run tests with UI (non-headless)
npm run test:e2e:ui
```
