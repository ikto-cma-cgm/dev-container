# WebdriverIO E2E Tests - my-awesome-app

> End-to-end testing with WebdriverIO running in Docker - Zero Node.js installation required!

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Tests

```bash
npm test
```

**First run?** Docker will build the image (takes 2-3 minutes). Subsequent runs are instant!

## 📁 Project Structure

```
webdriver-io/
├── Dockerfile.wdio          # Docker image with Node.js, Chrome, WebdriverIO
├── docker-compose.yml       # Docker configuration
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── wdio-config/
│   └── wdio.conf.js         # WebdriverIO configuration
├── tests/                   # YOUR TESTS HERE
│   ├── specs/               # Test files
│   ├── pageobjects/         # Page Object Models (optional)
│   └── helpers/             # Test utilities
├── test-results/            # Test output (auto-generated)
└── allure-results/          # Allure reports (auto-generated)
```

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests (in Docker)
npm test

# Run with browser visible (not headless)
npm run test:ui

# Debug mode (access container shell)
npm run test:debug

# Run tests directly (without Docker - needs Node.js locally)
npm run test:e2e
```

### Advanced

```bash
# Run specific test file
npm run test:e2e -- --spec=tests/specs/login.e2e.js

# Run specific test suite
npm run test:e2e -- --spec=tests/specs/forms/*.js

# Different environment
BASE_URL=https://staging.com npm test

# More parallelization
MAX_INSTANCES=10 npm test

# Non-headless (see browser)
HEADLESS=false npm test
```

### Docker Management

```bash
# Rebuild Docker image (after changing Dockerfile or dependencies)
npm run docker:build

# Start tests in background
npm run docker:up

# View logs
npm run docker:logs

# Stop containers
npm run docker:down

# Clean everything (containers, images, results)
npm run docker:clean
```

## ✍️ Writing Tests

### Basic Test

Create a file `tests/specs/my-test.e2e.js`:

```javascript
describe('My Feature', () => {
    it('should work correctly', async () => {
        await browser.url('/');
        await expect($('#my-element')).toBeDisplayed();
    });
});
```

### Using Page Objects

```javascript
// tests/pageobjects/login.page.js
class LoginPage {
    get usernameInput() { return $('#username'); }
    get passwordInput() { return $('#password'); }
    get submitButton() { return $('button[type="submit"]'); }

    async login(username, password) {
        await this.usernameInput.setValue(username);
        await this.passwordInput.setValue(password);
        await this.submitButton.click();
    }
}

module.exports = new LoginPage();
```

```javascript
// tests/specs/login.e2e.js
const LoginPage = require('../pageobjects/login.page');

describe('Login', () => {
    it('should login successfully', async () => {
        await browser.url('/login');
        await LoginPage.login('testuser', 'password');
        await expect(browser).toHaveUrl('/dashboard');
    });
});
```

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

Or pass variables directly:

```bash
BASE_URL=https://staging.com npm test
```

Available variables:
- `BASE_URL` - Application URL (default: http://localhost:3000)
- `BROWSER` - Browser to use (default: chrome)
- `HEADLESS` - Run headless (default: true)
- `MAX_INSTANCES` - Parallel tests (default: 5)
- `TEST_TIMEOUT` - Timeout in ms (default: 60000)
- `LOG_LEVEL` - Log level (default: info)

### WebdriverIO Configuration

Edit `wdio-config/wdio.conf.js` to customize:

```javascript
exports.config = {
    // Your customizations
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    // ... other options
};
```

## 📊 Reports

### Allure Reports

```bash
# Generate and open Allure report
npm run report:allure
```

Reports are in `allure-report/index.html`

### Screenshots

Screenshots of failed tests are automatically saved in `test-results/screenshots/`

### JUnit XML

JUnit reports are in `test-results/*.xml` (for CI/CD integration)

## 🔧 CI/CD Integration

Tests run automatically via GitHub Actions:

- ✅ On every Pull Request

See `.github/workflows/webdriverio.yml` for configuration.

## 🐛 Troubleshooting

### Docker image build fails

```bash
# Clean and rebuild
npm run docker:clean
npm run docker:build
```

### Tests can't connect to app

```bash
# Check your app is running on the correct port
curl http://localhost:3000

# Use host.docker.internal to access host from container
BASE_URL=http://host.docker.internal:3000 npm test
```

### Chrome crashes

The `shm_size: '2gb'` in `docker-compose.yml` should prevent this.
If it persists, increase to `4gb`.

### Permission issues with test results

```bash
# Change ownership
sudo chown -R $(whoami):$(whoami) test-results/ allure-results/
```

### Need to debug inside container

```bash
# Access container shell
npm run test:debug

# Inside container:
ls -la tests/
npm run test:e2e
```

## 💡 Pro Tips

### 1. Run Tests Against Different Environments

```bash
# Staging
BASE_URL=https://staging.myapp.com npm test

# Production smoke tests
BASE_URL=https://myapp.com npm test -- --spec=tests/specs/smoke/*.js
```

### 2. Watch Mode for Development

```bash
# Run in background and watch test files
npm run docker:up
# Edit tests, they rebuild automatically
```

### 3. Parallel Execution

```bash
# More parallelization for faster execution
MAX_INSTANCES=10 npm test
```

### 4. Debug Specific Test

```bash
# Run one test with UI visible
HEADLESS=false npm run test:e2e -- --spec=tests/specs/my-test.e2e.js
```

## 📚 Resources

- [WebdriverIO Documentation](https://webdriver.io/)
- [Best Practices](https://webdriver.io/docs/bestpractices)
- [API Reference](https://webdriver.io/docs/api)
- [Selectors](https://webdriver.io/docs/selectors)

## 🆘 Need Help?

- 💬 **Slack**: #quality-platform
- 📧 **Email**: quality-platform-team@your-company.com
- 📖 **WebdriverIO Docs**: https://webdriver.io/

---

**Framework**: mocha
**Base URL**: http://localhost:3000
**Generated**: 2026-01-09
