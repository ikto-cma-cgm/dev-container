# Node.js CI/CD Pipeline Templates

This repository contains production-ready CI/CD pipeline configurations for Node.js microservices.

## Supported Platforms

- **GitHub Actions**: `.github/workflows/ci-cd.yml`
- **Jenkins**: `Jenkinsfile`
- **GitLab CI**: `.gitlab-ci.yml`

## Features

- Automated testing with npm scripts
- Docker image building and publishing
- Security scanning integration
- Deployment to multiple environments
- Quality gate enforcement

## Usage

Copy the appropriate pipeline file to your Node.js project and customize the variables as needed.

## Configuration

Each pipeline supports the following configuration options:

- `NODE_VERSION`: Node.js version to use (default: 18)
- `DOCKER_REGISTRY`: Docker registry URL
- `DEPLOYMENT_ENV`: Target deployment environment
- `TEST_COVERAGE_THRESHOLD`: Minimum test coverage required
