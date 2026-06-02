# Node.js CI/CD Pipeline

Production-ready CI/CD pipeline configurations for Node.js microservices.

## Overview

This project provides three CI/CD platform implementations for Node.js services:

- **GitHub Actions** - Cloud-native CI/CD with GitHub
- **Jenkins** - Self-hosted CI/CD automation
- **GitLab CI** - GitLab's built-in CI/CD

## Features

All pipeline implementations include:

- ✅ Automated testing and linting
- ✅ Code quality and security scanning
- ✅ Docker image building and publishing
- ✅ Deployment automation (Kubernetes, Cloud Run, ECS)
- ✅ Database support for tests (PostgreSQL, MongoDB, MySQL)
- ✅ Redis integration for caching
- ✅ Code coverage reporting
- ✅ Dependency checking

## Directory Structure

```
nodejs-pipeline/
├── github-actions/    # GitHub Actions workflows
│   └── ci-cd.yml
├── jenkins/           # Jenkins pipeline
│   └── Jenkinsfile
├── gitlab-ci/         # GitLab CI configuration
│   └── .gitlab-ci.yml
└── README.md
```

## Platform-Specific Documentation

### GitHub Actions

**Location:** `.github/workflows/ci-cd.yml`

**Required Secrets:**
- `REGISTRY_URL` - Container registry URL
- `REGISTRY_USERNAME` - Registry username
- `REGISTRY_PASSWORD` - Registry password
- `KUBE_CONFIG` - Kubernetes configuration (for K8s deployment)
- `GCP_SA_KEY` - Google Cloud service account (for Cloud Run)

**Triggers:**
- Push to main/develop branches
- Pull requests to main branch

### Jenkins

**Location:** `Jenkinsfile`

**Requirements:**
- Jenkins 2.x with Pipeline plugin
- Docker plugin
- Kubernetes plugin (optional)

**Credentials:**
- `docker-registry-credentials` - Docker registry credentials
- `kubernetes-credentials` - Kubernetes config (for deployment)

**Pipeline Stages:**
1. Checkout
2. Install Dependencies
3. Lint
4. Test
5. Build
6. Docker Build & Push
7. Deploy

### GitLab CI

**Location:** `.gitlab-ci.yml`

**Required Variables:**
- `REGISTRY_URL` - Container registry URL
- `REGISTRY_USER` - Registry username
- `REGISTRY_PASSWORD` - Registry password
- `KUBE_CONFIG` - Kubernetes config (base64 encoded)

**Pipeline Stages:**
- test
- build
- security
- deploy

## Usage

### With Backstage Template

1. Navigate to Integration Service Catalog
2. Select "Node.js CI/CD Pipeline" template
3. Choose your CI/CD platform (GitHub Actions, Jenkins, or GitLab CI)
4. Fill in the configuration
5. A PR will be created with the pipeline configuration

### Manual Setup

#### GitHub Actions

```bash
cp github-actions/ci-cd.yml .github/workflows/ci-cd.yml
# Configure secrets in GitHub repository settings
```

#### Jenkins

```bash
cp jenkins/Jenkinsfile ./Jenkinsfile
# Configure credentials in Jenkins
# Create a Pipeline job pointing to your repository
```

#### GitLab CI

```bash
cp gitlab-ci/.gitlab-ci.yml ./.gitlab-ci.yml
# Configure CI/CD variables in GitLab project settings
```

## Configuration Options

### Node.js Version

All pipelines support Node.js 18.x, 20.x, and 22.x

### Database Support

- PostgreSQL 16
- MongoDB 7
- MySQL 8

### Deployment Targets

- Kubernetes
- Google Cloud Run
- AWS ECS
- Docker Swarm

### Security Scanning

- npm audit
- Trivy vulnerability scanner
- SonarQube (optional)

## Best Practices

1. **Branch Protection**: Enable branch protection rules for main/master
2. **Required Checks**: Make CI checks required before merging
3. **Secret Management**: Use platform-specific secret stores
4. **Environment Separation**: Use different configs for dev/staging/prod
5. **Rollback Strategy**: Always tag images and deployments

## Troubleshooting

### Tests Failing

- Check database connectivity in CI environment
- Verify environment variables are set correctly
- Review test logs for specific errors

### Docker Build Failing

- Ensure Dockerfile exists in repository root
- Check build context and .dockerignore
- Verify base image availability

### Deployment Issues

- Validate Kubernetes manifests
- Check deployment credentials
- Verify cluster connectivity

## Support

For issues or questions:
- Check pipeline logs
- Review platform-specific documentation
- Contact Platform Team