# 🚀 WebdriverIO E2E Testing - Quick Start

## Add E2E Testing in 2 Minutes

### Step 1: Open Backstage
Go to your Backstage catalog and find the **🧪 WebdriverIO E2E Testing** template.

### Step 2: Answer 3 Questions
Fill in:
1. **Project Name** - Your project name (e.g., `my-app`)
2. **Repository** - Select your GitHub repo
3. **Application URL** - Where your app runs (default: `http://localhost:3000`)

### Step 3: Create the PR
Click "Create". A pull request with the complete testing suite will be generated!

## 🎉 What You Get (Clé en main)

After merging the PR, you'll have a `webdriver-io/` directory with:
- **Zero Config Docker**: Runs Node, Chrome, and Drivers in one command.
- **Smart Waiting**: Automatically waits for your app to be ready.
- **Rich Examples**: Login, Nav, Forms, and Page Object Model patterns.
- **Beautiful Reports**: Allure and Spec reporters pre-configured.
- **CI/CD Ready**: GitHub Actions workflow included.

## ⚡ Run Your Tests

```bash
cd webdriver-io

# Install (light auxiliary dependencies)
npm install

# Run all tests (Recommended: Dockerized)
npm test

# See the browser (Local run)
npm run test:ui

# Debug mode
npm run test:debug
```

## ✍️ Write Your First Test

Create `tests/specs/my-test.e2e.js`:

```javascript
describe('My First Test', () => {
    it('should load characters', async () => {
        await browser.url('/');
        await expect(browser).toHaveTitle(expect.stringMatching(/.+/));
        await expect($('h1')).toBeDisplayed();
    });
});
```

## 📊 Default Setup

| Feature | Default |
|---------|---------|
| **Browser** | Chrome (Headless in Docker) |
| **Framework** | Mocha / Jasmine / Cucumber |
| **Reports** | Allure + Spec |
| **Parallel** | 5 instances |
| **CI/CD** | GitHub Actions |

## 🆘 Need Help?
- 💬 **Slack**: #quality-platform
- 📖 **Docs**: See the generated `README.md`
- 🎯 **Best Practices**: See the included `WEBDRIVERIO_BEST_PRACTICES.md`

**Happy Testing!** 🧪✨
