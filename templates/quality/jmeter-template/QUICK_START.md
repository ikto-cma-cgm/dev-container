# JMeter Template - Quick Start Guide

> Get load testing added to your project in 2 minutes

## Using the Template in Backstage

### Step 1: Create from Template

1. Go to Backstage → **Create** → **Choose a template**
2. Find **⚡ JMeter Load Testing**
3. Click **Choose**

### Step 2: Answer Questions (30 seconds)

**Required questions:**
- **Project Name**: `my-awesome-api` (lowercase, hyphens allowed)
- **Repository**: Select your repository
- **Target URL**: `http://localhost:8080` (or your API endpoint)

**Optional (click "Advanced Options" to customize):**
- Threads: `10` (number of virtual users)
- Duration: `60` (seconds)
- Include examples: `Yes` ← Recommended!
- Run on PRs: `No` (default for load tests)
- Scheduled: `No`

### Step 3: Create

Click **Create** button. A pull request will be created automatically!

## After the PR is Created

### Review the PR

The PR includes:
- Docker setup
- Example test plan (if you selected examples)
- GitHub Actions workflow
- Complete documentation

### Merge the PR

Once you're happy with the setup, merge the PR.

### Run Your First Test

```bash
# 1. Navigate to the jmeter directory
cd jmeter

# 2. Run the test
docker-compose up
```

First run takes 2-3 minutes to build Docker image. After that, it's instant!

### View the Results

```bash
# Open the HTML report
open reports/index.html
```

## What's Next?

### Customize for Your API

Edit `.env`:
```bash
TARGET_HOST=your-api.com
TARGET_PORT=443
TARGET_PROTOCOL=https
THREADS=20
DURATION=120
```

### Run Again

```bash
docker-compose up
```

### Add Your Own Tests

1. Create `.jmx` file in `test-plans/api/`
2. Use JMeter properties: `${__P(target.host,localhost)}`
3. Run: `TEST_PLAN=api/my-test.jmx docker-compose up`

## Common Customizations

### More Threads

```bash
THREADS=50 docker-compose up
```

### Longer Test

```bash
DURATION=300 docker-compose up
```

### Different Environment

```bash
TARGET_HOST=staging.example.com docker-compose up
```

## Need Help?

- 📖 See `jmeter/README.md` for full documentation
- 💬 Ask on Slack: #quality-platform
- 📧 Email: quality-platform-team@your-company.com

---

That's it! You now have professional load testing for your API! ⚡
