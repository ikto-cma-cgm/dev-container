# JMeter Pipeline Job

Ce dossier contient les fragments de pipeline réutilisables pour intégrer les tests de charge JMeter dans vos pipelines CI/CD.

## Structure

```
pipeline-job/
├── github-actions/
│   └── jmeter-job.yml    # Reusable workflow pour GitHub Actions
├── gitlab-ci/
│   └── jmeter-job.yml    # Job template pour GitLab CI
├── jenkins/
│   └── jmeter-job.groovy # Shared library pour Jenkins
└── README.md
```

## Prérequis

Ces jobs **attendent que le répertoire `jmeter/` existe** dans votre repository. Utilisez d'abord le template JMeter pour créer ce setup.

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

  deploy-staging:
    needs: build
    # ... deploy to staging

  load-tests:
    needs: deploy-staging
    uses: ./.github/workflows/jmeter-job.yml
    with:
      target_host: 'staging.example.com'
      target_port: '443'
      target_protocol: 'https'
      threads: 50
      duration: 120
```

### GitLab CI

```yaml
# .gitlab-ci.yml
include:
  - local: 'jmeter/.gitlab-ci-job.yml'

stages:
  - build
  - deploy
  - performance

deploy-staging:
  stage: deploy
  script:
    - # deploy to staging

load-tests:
  extends: .jmeter-load-tests
  stage: performance
  needs: [deploy-staging]
  variables:
    JMETER_TARGET_HOST: "staging.example.com"
    JMETER_THREADS: "50"
    JMETER_DURATION: "120"
```

### Jenkins

```groovy
// Jenkinsfile
@Library('jmeter-pipeline') _

pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm ci && npm run build'
            }
        }
        stage('Deploy Staging') {
            steps {
                // deploy
            }
        }
        stage('Load Tests') {
            steps {
                jmeterTests(
                    targetHost: 'staging.example.com',
                    targetPort: '443',
                    threads: 50,
                    duration: 120
                )
            }
        }
    }
}
```

## Paramètres

| Paramètre | Description | Défaut |
|-----------|-------------|--------|
| `target_host` | Hôte cible (sans protocole) | `localhost` |
| `target_port` | Port cible | `8080` |
| `target_protocol` | Protocole (http/https) | `http` |
| `threads` | Nombre d'utilisateurs virtuels | `10` |
| `duration` | Durée du test (secondes) | `60` |
| `ramp_up` | Période de montée en charge (s) | `10` |
| `performance_threshold` | Taux d'erreur max acceptable (%) | `5` |

## Variantes de Tests

### Smoke Test (validation rapide)
```groovy
jmeterTests.smokeTest(targetHost: 'api.example.com')
// threads: 1, duration: 10s
```

### Stress Test (montée en charge)
```groovy
jmeterTests.stressTest(targetHost: 'api.example.com')
// threads: 100, duration: 300s
```

### Endurance Test (test de durée)
```groovy
jmeterTests.enduranceTest(targetHost: 'api.example.com')
// threads: 20, duration: 1800s (30min)
```

## Support

- Slack: #quality-platform
- Email: quality-platform-team@example.com
