# Node.js CI/CD Pipeline

Production-ready CI/CD pipeline configurations for Node.js applications.

## Overview

This project provides three CI/CD platform implementations for Node.js applications:

- **GitHub Actions** - Cloud-native CI/CD with GitHub
- **Jenkins** - Self-hosted CI/CD automation
- **GitLab CI** - GitLab's built-in CI/CD

## Features

All pipeline implementations include:

- ? Automated testing and linting
- ? Build optimization and bundle analysis
- ? Security scanning (npm audit, Snyk)
- ? Docker image building
- ? Deployment automation (Kubernetes, Docker Swarm, Cloud Run, ECS)
- ? Preview deployments for pull requests
- ? Code coverage reporting
- ? SonarQube integration
- ? Automated dependency updates

## Directory Structure

```
nodejs-cicd/
??? github-actions/    # GitHub Actions workflows
?   ??? ci-cd.yml
??? jenkins/           # Jenkins pipeline
?   ??? Jenkinsfile
??? gitlab-ci/         # GitLab CI configuration
?   ??? .gitlab-ci.yml
??? README.md
```

## Platform-Specific Documentation

### GitHub Actions

**Supported Deployment Targets:**
- Kubernetes
- Docker Swarm
- Google Cloud Run
- AWS ECS
- Vercel (for serverless functions)

### Jenkins

**Requirements:**
- Jenkins 2.x with Pipeline plugin
- Docker plugin
- Node.js plugin
- SonarQube plugin
- Docker Compose plugin

### GitLab CI

**Integrated Features:**
- GitLab CI/CD pipelines
- Review apps for merge requests
- Environment management
- Security scanning integration

## Usage

Choose your preferred CI/CD platform and follow the setup instructions in the main README.md
