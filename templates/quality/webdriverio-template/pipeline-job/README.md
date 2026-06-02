# WebDriverIO Pipeline Job

Ce dossier contient les fragments de pipeline réutilisables pour intégrer les tests E2E WebDriverIO dans vos pipelines CI/CD.

## Structure

```
pipeline-job/
├── github-actions/
│   └── webdriverio-job.yml    # Reusable workflow pour GitHub Actions
├── gitlab-ci/
│   └── webdriverio-job.yml    # Job template pour GitLab CI
├── jenkins/
│   └── webdriverio-job.groovy # Shared library pour Jenkins
└── README.md
```

## Prérequis

Ces jobs **attendent que le répertoire `webdriver-io/` existe** dans votre repository. Utilisez d'abord le template WebDriverIO pour créer ce setup.

## Usage

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build

  e2e-tests:
    needs: build
    uses: ./.github/workflows/webdriverio-job.yml
    with:
      base_url: 'http://localhost:3000'
      execution_mode: 'docker'
```

### GitLab CI

```yaml
# .gitlab-ci.yml
include:
  - local: 'webdriver-io/.gitlab-ci-job.yml'

stages:
  - build
  - test

build:
  stage: build
  script:
    - npm ci && npm run build

e2e-tests:
  extends: .webdriverio-e2e-tests
  stage: test
  variables:
    WDIO_BASE_URL: "http://localhost:3000"
```

### Jenkins

```groovy
// Jenkinsfile
@Library('webdriverio-pipeline') _

pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm ci && npm run build'
            }
        }
        stage('E2E Tests') {
            steps {
                webdriverioTests(
                    baseUrl: 'http://localhost:3000',
                    executionMode: 'docker'
                )
            }
        }
    }
}
```

## Paramètres

| Paramètre | Description | Défaut |
|-----------|-------------|--------|
| `base_url` | URL de l'application à tester | `http://localhost:3000` |
| `execution_mode` | Mode d'exécution (docker/local/cloud) | `docker` |
| `working_directory` | Chemin vers le dossier webdriver-io | `webdriver-io` |
| `max_instances` | Nombre d'instances parallèles | `5` |
| `upload_artifacts` | Upload des screenshots/rapports | `true` |
| `fail_on_error` | Échec du job si tests échouent | `true` |

## Support

- Slack: #quality-platform
- Email: quality-platform-team@example.com
