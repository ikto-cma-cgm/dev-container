# Full-Stack Web Service CI/CD Pipeline

Production-ready CI/CD pipeline configurations for full-stack monorepo applications (React + Node.js).

## Overview

Coordinated CI/CD pipelines for frontend and backend services in a monorepo:

- **GitHub Actions** - Parallel jobs for frontend and backend
- **Jenkins** - Multi-stage pipeline with service coordination
- **GitLab CI** - Integrated monorepo support

## Features

- ✅ Parallel testing of frontend and backend
- ✅ Coordinated deployment process
- ✅ Full application E2E testing
- ✅ Docker compose for integration tests
- ✅ Synchronized versioning
- ✅ Health checks and verification

## Directory Structure

```
fullstack-pipeline/
├── github-actions/    # GitHub Actions workflows
│   └── ci-cd.yml
├── jenkins/           # Jenkins pipeline
│   └── Jenkinsfile
├── gitlab-ci/         # GitLab CI configuration
│   └── .gitlab-ci.yml
└── README.md
```

## Usage

Perfect for monorepos with:
- Frontend in `/frontend` directory
- Backend in `/backend` directory
- Shared dependencies in root `package.json`