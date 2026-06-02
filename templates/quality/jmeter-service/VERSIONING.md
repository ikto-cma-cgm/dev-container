# Versioning Strategy

The JMeter Load Testing Service follows **Semantic Versioning** (MAJOR.MINOR.PATCH).

## Version Format: MAJOR.MINOR.PATCH

### MAJOR Version (1.x → 2.x)

**When**: Breaking changes that require team action

**Examples**:
- JMeter upgrade with incompatible changes (5.x → 6.x)
- Java version upgrade (17 → 21)
- Removal of deprecated environment variables
- Docker base image change affecting compatibility
- Required test plan structure changes

**Process**:
1. Announce 3 weeks before release
2. Provide migration guide
3. Support old version for 6 months
4. Test with pilot projects first

### MINOR Version (1.1 → 1.2)

**When**: New features, backward compatible

**Examples**:
- New JMeter plugins added
- Additional example test plans
- New configuration options
- Enhanced reporting features
- New environment variables (with defaults)
- Performance improvements

**Process**:
1. Announce 1 week before release
2. Document new features in CHANGELOG
3. Test with pilot projects
4. Roll out gradually

### PATCH Version (1.2.3 → 1.2.4)

**When**: Bug fixes, no new features

**Examples**:
- Security patches
- Bug fixes in entrypoint script
- Configuration file corrections
- Documentation updates
- Dependency updates (security)

**Process**:
1. No announcement needed
2. Deploy immediately
3. Update CHANGELOG

## Release Checklist

### Before Release

- [ ] Update VERSION in Makefile
- [ ] Update version in Dockerfile LABEL
- [ ] Update CHANGELOG.md
- [ ] Test on Mac Intel
- [ ] Test on Mac M1/M2
- [ ] Test on Linux
- [ ] Run security scan (`make scan`)
- [ ] Update documentation if needed

### Release Steps

```bash
# 1. Tag the release
git tag -a v1.2.3 -m "Release version 1.2.3"

# 2. Push tag
git push origin v1.2.3

# 3. GitHub Actions will automatically build and publish

# 4. Verify published images
docker pull your-registry.com/jmeter-service:1.2.3
docker run --rm your-registry.com/jmeter-service:1.2.3 jmeter --version
```

### Communication

**MAJOR**: Email + Slack announcement + Migration guide
**MINOR**: Slack announcement + CHANGELOG link
**PATCH**: CHANGELOG update only

## Support Policy

- **Current version (N)**: Full support
- **Previous version (N-1)**: Security patches only
- **Older versions**: No support

## Deprecation Policy

When deprecating features:
1. Mark as deprecated in version N
2. Continue support in N+1 and N+2
3. Remove in N+3

Minimum 6-month transition period for breaking changes.

## Monthly Maintenance

**When**: First Tuesday of each month, 10:00-12:00

**Tasks**:
- Review and update dependencies
- Check for JMeter updates
- Security scan with Trivy
- Review open issues
- Update documentation
- Test multi-platform builds

## 2026 Objectives

- **Q1**: Achieve 95% adoption of version 1.x
- **Q2**: Add distributed testing support (1.1.0)
- **Q3**: Implement real-time monitoring (1.2.0)
- **Q4**: Review for potential 2.0.0 with JMeter 6.x

---

**Questions?** Contact Quality Platform Team or #quality-platform on Slack
