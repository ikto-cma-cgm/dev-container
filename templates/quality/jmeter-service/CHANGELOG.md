# Changelog

All notable changes to the JMeter Load Testing Service will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-13

### Added
- Initial stable release of JMeter Load Testing Service
- Docker-based JMeter 5.6.3 with Java 17
- Multi-platform support (linux/amd64, linux/arm64)
- Essential JMeter plugins pre-installed
- HTTP Request Defaults configuration
- HTML Dashboard reporting
- Example test plans (simple load test, ramp-up test)
- Environment variable configuration
- Cross-platform volume mounting (Mac/Linux/Windows)
- Automatic test plan detection
- Non-root user execution (UID 1000)
- GitHub Actions workflow for CI/CD
- Comprehensive documentation

### Features
- **Technology Stack**:
  - JMeter 5.6.3
  - Java 17 (Eclipse Temurin)
  - Alpine Linux base
  - JMeter Plugins Manager 1.10

- **Pre-installed Plugins**:
  - Custom Thread Groups (jpgc-casutg)
  - JSON Path Extractor (jpgc-json)
  - PerfMon (jpgc-perfmon)
  - Synthesis Report (jpgc-synthesis)
  - Additional Functions (jpgc-functions)
  - Basic and Additional Graphs

- **Reporting**:
  - HTML Dashboard (native JMeter)
  - JTL results files
  - Summary reports
  - Response time percentiles

- **Configuration**:
  - Parameterized test plans
  - Environment variable overrides
  - Custom JMeter properties support
  - Flexible entrypoint script

### Versioning Strategy

See [VERSIONING.md](./VERSIONING.md) for our versioning approach and update policies.

### Migration Guide

This is the first release. No migration needed.

---

## Future Releases

### Planned for 1.1.0
- Additional protocol support (JDBC, FTP)
- InfluxDB Backend Listener integration
- Distributed testing support
- More example test plans

### Planned for 1.2.0
- Grafana dashboard templates
- Real-time monitoring improvements
- Performance optimizations

---

**Maintained by Quality Platform Team**
