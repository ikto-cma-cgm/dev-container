# Test Helpers

This directory contains utility functions and helpers for your WebdriverIO tests.

## Files

- `test-data.js`: Centralized test data management

## Usage

```javascript
const testData = require('../helpers/test-data');

// Use test data in your tests
await LoginPage.login(testData.users.valid.username, testData.users.valid.password);
```

## Best Practices

- Keep test data separate from test logic
- Use environment variables for sensitive data
- Generate dynamic data for unique values
- Organize test data by feature or module
