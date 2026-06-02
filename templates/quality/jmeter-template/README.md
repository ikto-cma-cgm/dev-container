# JMeter Load Testing Template

> Backstage template for adding JMeter load testing to your projects

## Overview

This template adds a complete JMeter load testing setup to your project via Backstage. It generates a ready-to-use configuration with Docker, example test plans, and CI/CD integration.

## What Gets Generated

When you use this template, it creates:

- **Docker Setup** - Dockerfile and docker-compose.yml using the JMeter service
- **Test Plans** - Example JMX files for HTTP/API load testing
- **Test Data** - Sample CSV files for data-driven tests
- **Configuration** - Environment variables and JMeter properties
- **CI/CD** - GitHub Actions workflow for automated testing
- **Documentation** - Complete README with usage instructions

## Features

- ⚡ **Zero Config** - Works out of the box with smart defaults
- 🐳 **Dockerized** - No local Java/JMeter installation needed
- 📊 **HTML Reports** - Beautiful dashboards automatically generated
- 🔧 **Parameterized** - Configure via environment variables
- 🚀 **CI/CD Ready** - GitHub Actions workflow included
- 📚 **Examples** - Learn from working test plans

## Usage

### In Backstage

1. Navigate to **Create** → **Choose a template**
2. Select **⚡ JMeter Load Testing**
3. Answer 3 simple questions:
   - Project name
   - Repository
   - Target URL
4. (Optional) Customize advanced options
5. Click **Create**

A pull request will be created with the complete setup!

### What You'll Configure

**Required (3 questions)**:
- **Project Name** - Your project identifier
- **Repository** - Where to add the tests
- **Target URL** - API endpoint to test

**Optional**:
- Thread count (default: 10)
- Test duration (default: 60s)
- Include example tests (default: yes)
- Run on PRs (default: no)
- Scheduled tests (default: no)

## Generated Structure

```
jmeter/
├── docker-compose.yml       # Docker orchestration
├── Dockerfile.jmeter       # Custom Docker image
├── .env.example            # Environment template
├── test-plans/
│   └── api/
│       └── load-test.jmx   # Example test plan
├── test-data/
│   └── sample-users.csv    # Sample data
├── results/                # Test results (generated)
├── reports/                # HTML reports (generated)
└── README.md              # Usage documentation
```

## Quick Start (After Generation)

```bash
cd jmeter
docker-compose up
open reports/index.html
```

## Template Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `projectName` | - | Project identifier (required) |
| `targetUrl` | http://localhost:8080 | API endpoint to test |
| `defaultThreads` | 10 | Number of virtual users |
| `defaultDuration` | 60 | Test duration in seconds |
| `includeExampleTests` | true | Include example test plans |
| `runOnPR` | false | Run tests on pull requests |
| `runScheduled` | false | Run tests nightly |

## Examples

### Basic API Load Test

```yaml
projectName: my-api
targetUrl: https://api.example.com
defaultThreads: 10
defaultDuration: 60
```

Generates a basic load test with 10 users for 60 seconds.

### High Load Stress Test

```yaml
projectName: my-api
targetUrl: https://api.staging.com
defaultThreads: 100
defaultDuration: 300
runScheduled: true
```

Generates a stress test with 100 users for 5 minutes, runs nightly.

## Test Plan Parameterization

Generated test plans use JMeter properties:

```xml
<stringProp name="HTTPSampler.domain">${__P(target.host,localhost)}</stringProp>
<stringProp name="ThreadGroup.num_threads">${__P(threads,10)}</stringProp>
<stringProp name="ThreadGroup.duration">${__P(duration,60)}</stringProp>
```

Override via environment variables:
```bash
TARGET_HOST=staging.com THREADS=50 docker-compose up
```

## CI/CD Integration

The generated GitHub Actions workflow:

- Triggers on workflow_dispatch (manual)
- Optionally runs on PRs
- Optionally runs on schedule
- Uploads HTML reports as artifacts
- Configurable target URL and load parameters

## Customization After Generation

1. **Add More Test Plans** - Create new .jmx files in `test-plans/`
2. **Custom Configuration** - Edit `config/jmeter.properties`
3. **Test Data** - Add CSV files to `test-data/`
4. **Adjust Resources** - Modify `docker-compose.yml` resource limits
5. **JVM Tuning** - Update `HEAP` in `.env`

## Support

- **Template Issues**: Contact Quality Platform Team
- **JMeter Help**: https://jmeter.apache.org/usermanual/
- **Slack**: #quality-platform

## Maintenance

This template is maintained by the Quality Platform Team.

- **Version**: 1.0.0
- **JMeter**: 5.6.3
- **Java**: 17

See [jmeter-service](../jmeter-service/) for the underlying Docker service.

---

**Maintained by Quality Platform Team**
