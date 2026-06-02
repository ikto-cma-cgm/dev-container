# JMeter Load Testing Service

> Docker-based JMeter service for HTTP/API load testing. Zero local dependencies, cross-platform compatible, production-ready.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](./CHANGELOG.md)
[![JMeter](https://img.shields.io/badge/JMeter-5.6.3-orange.svg)](https://jmeter.apache.org/)
[![Java](https://img.shields.io/badge/Java-17-red.svg)](https://adoptium.net/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

## Features

- **Dockerized Environment** - Java, JMeter, and plugins all containerized
- **Zero Local Dependencies** - Everything runs in Docker
- **Cross-Platform** - Works on Mac (Intel/M1/M2), Linux, Windows
- **HTTP/API Testing** - Optimized for REST API load testing
- **HTML Dashboard** - Beautiful test reports out of the box
- **Parameterized Tests** - Configure via environment variables
- **CI/CD Ready** - GitHub Actions workflow included
- **Multi-Platform Images** - AMD64 and ARM64 support

## Quick Start

### Prerequisites

- Docker Desktop (Mac/Windows) or Docker Engine (Linux)
- Docker Compose v2.x

### Run Your First Test

```bash
# 1. Clone or navigate to the service directory
cd jmeter-service

# 2. Set your target URL
export TARGET_HOST=api.example.com
export TARGET_PORT=443
export TARGET_PROTOCOL=https

# 3. Run the example test
make test

# 4. View the HTML report
open examples/minimal-project/reports/index.html
```

That's it! The first run builds the Docker image (takes 2-3 min), then subsequent runs are instant.

## Usage

### Build the Docker Image

```bash
# Local build
make build

# Multi-platform build (AMD64 + ARM64)
make build-multi
```

### Run Tests

#### Using Docker Compose (Recommended)

```bash
cd examples/minimal-project

# Run with environment variables
TARGET_HOST=api.staging.com \
TARGET_PORT=443 \
TARGET_PROTOCOL=https \
THREADS=20 \
DURATION=120 \
docker-compose up
```

#### Using Docker Run

```bash
docker run --rm \
  -v $(pwd)/test-plans:/jmeter/test-plans:ro \
  -v $(pwd)/test-data:/jmeter/test-data:ro \
  -v $(pwd)/results:/jmeter/results:rw \
  -v $(pwd)/reports:/jmeter/reports:rw \
  -e TARGET_HOST=api.example.com \
  -e TARGET_PORT=443 \
  -e TARGET_PROTOCOL=https \
  -e THREADS=10 \
  -e DURATION=60 \
  jmeter-service:latest
```

#### Using Makefile Commands

```bash
# Run tests
make test

# Open shell for debugging
make test-shell

# Run example project
make example

# View logs
make logs
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TARGET_HOST` | localhost | Target server hostname |
| `TARGET_PORT` | 8080 | Target server port |
| `TARGET_PROTOCOL` | http | Protocol (http/https) |
| `THREADS` | 10 | Number of virtual users |
| `RAMP_UP` | 10 | Ramp-up time in seconds |
| `DURATION` | 60 | Test duration in seconds |
| `TEST_PLAN` | (auto) | Specific JMX file to run |
| `GENERATE_REPORT` | true | Generate HTML dashboard |
| `HEAP` | -Xms1g -Xmx1g | JVM heap settings |
| `TZ` | Europe/Paris | Timezone |

### Test Plan Structure

Organize your test plans by type:

```
test-plans/
├── api/
│   ├── simple-load-test.jmx      # GET/POST examples
│   └── ramp-up-test.jmx           # Progressive load
├── stress/
│   └── stress-test.jmx
└── endurance/
    └── endurance-test.jmx
```

### Reports

The HTML Dashboard is automatically generated at `/jmeter/reports/index.html` and includes:

- Response time over time
- Active threads over time
- Transactions per second
- Response time percentiles (90th, 95th, 99th)
- Request statistics table
- Error analysis

## CI/CD Integration

### GitHub Actions

```yaml
name: Load Tests

on:
  workflow_dispatch:
    inputs:
      target_url:
        description: 'Target URL'
        required: true
        default: 'https://staging.example.com'

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run JMeter tests
        run: |
          docker-compose -f jmeter/docker-compose.yml up --abort-on-container-exit
        env:
          TARGET_HOST: ${{ github.event.inputs.target_url }}

      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: jmeter-report
          path: jmeter/reports/
```

### GitLab CI

```yaml
load_test:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker-compose -f jmeter/docker-compose.yml up --abort-on-container-exit
  artifacts:
    paths:
      - jmeter/reports/
    expire_in: 1 week
```

## Advanced Usage

### Custom JMeter Properties

Mount custom configuration:

```yaml
volumes:
  - ./config/custom.properties:/jmeter/config/user.properties:ro
```

### Using Different Test Plans

```bash
# Specify test plan
docker-compose run jmeter-tests jmeter \
  -n \
  -t /jmeter/test-plans/stress/stress-test.jmx \
  -l /jmeter/results/results.jtl
```

### Debugging

```bash
# Access container shell
make test-shell

# Run JMeter in GUI mode (local JMeter required)
jmeter -t test-plans/api/simple-load-test.jmx
```

## Multi-Platform Support

This image is built for multiple platforms:

- `linux/amd64` - Intel/AMD processors (most CI/CD, Linux servers)
- `linux/arm64` - Apple Silicon (M1/M2/M3 Macs), ARM servers

Docker automatically pulls the correct image for your platform.

## Troubleshooting

### Tests Not Running

```bash
# Check if test plans are mounted correctly
docker-compose run jmeter-tests bash
ls -la /jmeter/test-plans

# Check JMeter version
docker-compose run jmeter-tests jmeter --version
```

### Memory Issues

```bash
# Increase heap size
export HEAP="-Xms2g -Xmx4g -XX:MaxMetaspaceSize=512m"
docker-compose up
```

### Permission Issues (Windows)

Ensure Docker Desktop has permission to access your project directory:
1. Docker Desktop → Settings → Resources → File Sharing
2. Add your project directory

## Project Structure

```
jmeter-service/
├── Dockerfile                   # Service image definition
├── entrypoint.sh               # Flexible command execution
├── docker-compose.yml          # Service orchestration
├── Makefile                    # Build/test commands
├── config/                     # Base JMeter configuration
│   ├── jmeter.properties
│   ├── user.properties
│   └── reportgenerator.properties
├── plugins/
│   └── plugin-list.txt         # JMeter plugins to install
├── examples/minimal-project/    # Working example
│   ├── test-plans/
│   ├── test-data/
│   ├── results/                # Generated
│   └── reports/                # Generated
└── .github/workflows/          # CI/CD automation
```

## Versioning

This service follows [Semantic Versioning](./VERSIONING.md):

- **MAJOR** (1.x → 2.x): Breaking changes, requires team updates
- **MINOR** (1.1 → 1.2): New features, backward compatible
- **PATCH** (1.2.3 → 1.2.4): Bug fixes only

See [CHANGELOG.md](./CHANGELOG.md) for version history.

## Support

- **Documentation**: See [CHANGELOG.md](./CHANGELOG.md), [VERSIONING.md](./VERSIONING.md)
- **Platform Team**: [PLATFORM_TEAM_GUIDE.md](./PLATFORM_TEAM_GUIDE.md)
- **Issues**: Report bugs or request features via your issue tracker
- **Slack**: #quality-platform

## License

MIT License - see LICENSE file for details

---

**Maintained by Quality Platform Team**
