# 🚀 WebdriverIO E2E Tests - ${{ values.projectName }}

> End-to-end testing with WebdriverIO running in Docker - A standalone, turnkey solution for high-quality automation.

## 🚀 Quick Start (Clé en main)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests (Docker)
```bash
npm test
```

**First run?** Docker will build the image (takes 2-3 minutes). Subsequent runs are instant!
The tests will automatically wait for your application URL (${{ values.baseUrl }}) to be reachable before starting.

## 📁 Project Structure

```text
webdriver-io/
├── Dockerfile.wdio          # Complete testing environment (Node, Chrome, Driver)
├── docker-compose.yml       # Docker orchestration
├── package.json             # Test dependencies and scripts
├── .env.example             # Configuration settings
├── wait-for-url.sh          # Strategy to wait for app availability
├── wdio-config/
│   └── wdio.conf.js         # WebdriverIO configuration
├── tests/                   # YOUR TESTS HERE
│   ├── specs/               # Test suites (.e2e.js files)
│   ├── pageobjects/         # Page Object Model components
│   └── helpers/             # Shared utilities & API helpers
├── test-results/            # Results, screenshots & XML (auto-generated)
└── allure-results/          # Allure report data (auto-generated)
```

## 🧪 Running Tests

### Standard Commands
```bash
# Recommended: Run all tests in isolated Docker container
npm test

# Run with visible UI (needs local Chrome/Node.js)
npm run test:ui

# Debug mode: Access container shell for troubleshooting
npm run test:debug

# Fast local run (without Docker)
npm run test:local
```

### Custom Execution
```bash
# Run a specific test file
npm run test:local -- --spec tests/specs/example.e2e.js

# Test a different environment (e.g. staging)
BASE_URL=https://staging.myapp.com npm test

# Increase parallelization
MAX_INSTANCES=10 npm test

# See the browser inside Docker (if VNC/X11 is configured, otherwise use test:ui)
HEADLESS=false npm test
```

## ✍️ Writing Tests

Tests use the **${{ values.testFramework }}** framework. Examples are provided in `tests/specs/`.

```javascript
describe('My Feature', () => {
    it('should navigate and find elements', async () => {
        await browser.url('/');
        await expect($('h1')).toBeDisplayed();
    });
});
```

## 📊 Results & Reports

- **Screenshots**: Automatically taken on failure in `test-results/screenshots/`.
- **JUnit**: XML reports generated in `test-results/` for CI/CD.
- **Allure**: Beautiful HTML reports.
  ```bash
  npm run report:allure
  ```

## ⚙️ Configuration

Available variables in `.env` or as CLI:
- `BASE_URL`: Target application URL (default: ${{ values.baseUrl }})
- `LOG_LEVEL`: verbose, info, error (default: info)
- `MAX_INSTANCES`: Parallel test runs (default: ${{ values.maxInstances }})
- `HEADLESS`: Run without browser UI (default: true)

## 🔧 CI/CD Integration

Tests are pre-configured to run automatically:
{% if values.runOnPR %}- ✅ On every **Pull Request**{% endif %}
{% if values.runOnPush %}- ✅ On **push** to main branches{% endif %}
{% if values.runScheduled %}- ✅ **Nightly** at ${{ values.scheduleCron }}{% endif %}

## 🐛 Troubleshooting

1. **App not reachable**: Double check if your app is running at `${{ values.baseUrl }}`. If running from Docker, remember to use `http://host.docker.internal:PORT`.
2. **Docker issues**: Run `npm run docker:clean` then `npm test`.
3. **Permissions**: If results folders have permission issues, run `sudo chown -R $USER:$USER test-results allure-results`.

---
🤖 *Template maintained by the Quality Team. Happy Testing!* 🧪
