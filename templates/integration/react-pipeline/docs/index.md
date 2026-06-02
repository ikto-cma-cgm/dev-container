# React/Next.js CI/CD Pipeline

Production-ready CI/CD pipeline configurations for React and Next.js applications.

## Overview

This project provides three CI/CD platform implementations for React/Next.js frontends:

- **GitHub Actions** - Cloud-native CI/CD with GitHub
- **Jenkins** - Self-hosted CI/CD automation
- **GitLab CI** - GitLab's built-in CI/CD

## Features

All pipeline implementations include:

- ? Automated testing and linting
- ? Build optimization and bundle analysis
- ? Lighthouse performance audits
- ? End-to-end testing with Playwright
- ? Docker image building
- ? Deployment automation (Vercel, Netlify, Kubernetes, etc.)
- ? Preview deployments for pull requests
- ? Security scanning

## Directory Structure

```
react-pipeline/
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
- Vercel
- Netlify
- Cloudflare Pages
- AWS Amplify
- Kubernetes
- Docker

### Jenkins

**Requirements:**
- Jenkins 2.x with Pipeline plugin
- Docker plugin
- Node.js plugin

### GitLab CI

**Integrated Features:**
- GitLab Pages deployment
- Review apps for merge requests
- Environment management

## Usage

Choose your preferred CI/CD platform and follow the setup instructions in the main README.md
