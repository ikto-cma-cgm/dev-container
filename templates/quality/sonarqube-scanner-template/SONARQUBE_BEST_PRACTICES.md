# SonarQube Best Practices

Ce document décrit les meilleures pratiques pour l'utilisation de SonarQube dans vos projets.

## 📋 Table des matières

- [Configuration Générale](#configuration-générale)
- [Quality Gates](#quality-gates)
- [Code Coverage](#code-coverage)
- [Règles et Quality Profiles](#règles-et-quality-profiles)
- [Exclusions](#exclusions)
- [Sécurité](#sécurité)
- [Performance](#performance)
- [Intégration CI/CD](#intégration-cicd)

## Configuration Générale

### Structure du projet

```
project/
├── sonar-project.properties    # Configuration principale
├── sonar-config/
│   ├── docker-compose.sonar.yml
│   └── quality-profiles/
└── .github/workflows/
    └── sonarqube.yml
```

### sonar-project.properties

Configurez toujours ces propriétés de base:

```properties
sonar.projectKey=unique-project-key
sonar.projectName=Human Readable Name
sonar.projectVersion=1.0.0
sonar.sourceEncoding=UTF-8
```

## Quality Gates

### Niveaux de Quality Gate

#### 🔴 Strict (Production)
Recommandé pour les projets en production critique:

- **New Code Coverage**: ≥ 90%
- **Overall Coverage**: ≥ 80%
- **Duplications**: ≤ 3%
- **Maintainability Rating**: A
- **Reliability Rating**: A
- **Security Rating**: A
- **Security Hotspots**: 0 (tous reviewés)

```bash
# Configuration via API
curl -u token: -X POST "$SONAR_HOST_URL/api/qualitygates/create?name=Strict"
curl -u token: -X POST "$SONAR_HOST_URL/api/qualitygates/create_condition?gateName=Strict&metric=new_coverage&op=LT&error=90"
```

#### 🟡 Balanced (Recommandé)
Équilibre entre qualité et flexibilité:

- **New Code Coverage**: ≥ 80%
- **Overall Coverage**: ≥ 70%
- **Duplications**: ≤ 5%
- **Maintainability Rating**: A ou B
- **Reliability Rating**: A
- **Security Rating**: A

#### 🟢 Lenient (Développement)
Pour les projets en phase de développement rapide:

- **New Code Coverage**: ≥ 70%
- **Overall Coverage**: ≥ 60%
- **Duplications**: ≤ 10%
- **Pas d'issues critiques**

### Personnalisation des Quality Gates

```properties
# Dans sonar-project.properties
sonar.qualitygate.wait=true
sonar.qualitygate.timeout=300
```

## Code Coverage

### Configuration Coverage Reports

#### Jest/Vitest (Frontend/Backend)

```json
// package.json
{
  "scripts": {
    "test": "jest --coverage",
    "test:coverage": "jest --coverage --coverageReporters=text --coverageReporters=lcov"
  },
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.test.{js,jsx,ts,tsx}",
      "!src/**/*.spec.{js,jsx,ts,tsx}",
      "!src/**/index.{js,ts}"
    ],
    "coverageThresholds": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

#### Configuration SonarQube

```properties
# Frontend
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.lcov.reportPaths=coverage/lcov.info

# Monorepo
sonar.javascript.lcov.reportPaths=apps/frontend/coverage/lcov.info,apps/backend/coverage/lcov.info
```

### Exclusions de Coverage

```properties
sonar.coverage.exclusions=\
  **/*.test.ts,\
  **/*.test.tsx,\
  **/*.spec.ts,\
  **/*.spec.tsx,\
  **/test/**,\
  **/tests/**,\
  **/mocks/**,\
  **/__mocks__/**,\
  **/*.config.js,\
  **/*.config.ts,\
  **/setupTests.ts
```

## Règles et Quality Profiles

### Quality Profiles recommandés

#### TypeScript/JavaScript

**Règles critiques à activer:**

- `typescript:S1135` - Track TODOs
- `typescript:S3776` - Cognitive Complexity
- `typescript:S1541` - Cyclomatic Complexity
- `typescript:S2699` - Tests should include assertions
- `typescript:S4144` - Duplicate Functions
- `typescript:S1192` - String literals should not be duplicated

**Règles à désactiver pour les tests:**

```properties
sonar.issue.ignore.multicriteria=e1,e2,e3

# Disable complexity checks in tests
sonar.issue.ignore.multicriteria.e1.ruleKey=typescript:S3776
sonar.issue.ignore.multicriteria.e1.resourceKey=**/*.test.ts*

# Allow console.log in development utilities
sonar.issue.ignore.multicriteria.e2.ruleKey=typescript:S2228
sonar.issue.ignore.multicriteria.e2.resourceKey=**/src/utils/logger.ts

# Allow TODO comments temporarily
sonar.issue.ignore.multicriteria.e3.ruleKey=typescript:S1135
sonar.issue.ignore.multicriteria.e3.resourceKey=**/*
```

### Custom Quality Profile

Créez un profil personnalisé pour votre équipe:

1. Via l'interface SonarQube: Quality Profiles > Create
2. Hériter du profil "Sonar way"
3. Activer/désactiver les règles selon vos besoins
4. Exporter le profil en XML pour versioning

## Exclusions

### Fichiers à exclure

```properties
sonar.exclusions=\
  **/node_modules/**,\
  **/dist/**,\
  **/build/**,\
  **/coverage/**,\
  **/*.test.ts,\
  **/*.test.tsx,\
  **/*.spec.ts,\
  **/*.spec.tsx,\
  **/public/**,\
  **/.next/**,\
  **/out/**,\
  **/*.d.ts,\
  **/__generated__/**,\
  **/migrations/**,\
  **/seeds/**
```

### Tests

```properties
sonar.tests=src,test,tests
sonar.test.inclusions=\
  **/*.test.ts,\
  **/*.test.tsx,\
  **/*.spec.ts,\
  **/*.spec.tsx,\
  **/tests/**,\
  **/test/**
```

### Duplication

Exclure les fichiers où la duplication est acceptable:

```properties
sonar.cpd.exclusions=\
  **/*.test.ts,\
  **/*.test.tsx,\
  **/*.spec.ts,\
  **/*.spec.tsx,\
  **/migrations/**,\
  **/constants.ts
```

## Sécurité

### Security Hotspots

Configurez la priorité de revue:

```properties
sonar.security.hotspots.reviewPriority=MEDIUM
```

### Issues de sécurité à surveiller

- **SQL Injection**: Utiliser des prepared statements
- **XSS**: Sanitizer les inputs utilisateur
- **CSRF**: Utiliser des tokens CSRF
- **Secrets**: Ne jamais commiter de secrets
- **Dependencies**: Surveiller les vulnérabilités

### Scanner les secrets

Activez la détection de secrets:

```properties
# Patterns pour détecter les secrets
sonar.issue.enforce.multicriteria=s1,s2
sonar.issue.enforce.multicriteria.s1.ruleKey=typescript:S6353
sonar.issue.enforce.multicriteria.s1.resourceKey=**/*
```

## Performance

### Optimisation du scan

#### Service Éphémère

```yaml
# docker-compose.sonar.yml
environment:
  SONAR_ES_BOOTSTRAP_CHECKS_DISABLE: true
  SONAR_JAVA_OPTS: -Xms512m -Xmx1024m
```

#### Exclusions intelligentes

Exclure les gros fichiers non critiques:

```properties
sonar.exclusions=\
  **/*.min.js,\
  **/*.bundle.js,\
  **/vendor/**
```

#### Parallel execution

```properties
# Augmenter le nombre de threads
sonar.cpd.threads=4
```

### Temps de scan

**Cibles recommandées:**
- Petit projet (< 10k LOC): < 2 min
- Projet moyen (10k-50k LOC): 2-5 min
- Grand projet (> 50k LOC): 5-15 min

## Intégration CI/CD

### GitHub Actions

#### Workflow optimal

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Important pour l'analyse

      - name: Run tests with coverage
        run: npm run test -- --coverage

      - name: SonarQube Scan
        run: npx sonarqube-scanner

      - name: Quality Gate
        run: |
          # Vérifier le quality gate
          # Bloquer si échec en production
```

#### Cache pour accélérer

```yaml
- name: Cache SonarQube packages
  uses: actions/cache@v3
  with:
    path: ~/.sonar/cache
    key: {% raw %}${{ runner.os }}{% endraw %}-sonar
```

### Branch Analysis

```yaml
- name: SonarQube Scan
  run: |
    npx sonarqube-scanner \
      -Dsonar.branch.name={% raw %}${{ github.ref_name }}{% endraw %} \
      -Dsonar.pullrequest.key={% raw %}${{ github.event.number }}{% endraw %} \
      -Dsonar.pullrequest.branch={% raw %}${{ github.head_ref }}{% endraw %} \
      -Dsonar.pullrequest.base={% raw %}${{ github.base_ref }}{% endraw %}
  if: github.event_name == 'pull_request'
```

### PR Decoration

Activer les commentaires sur les PRs:

```properties
sonar.pullrequest.github.repository=owner/repo
sonar.pullrequest.provider=github
```

```yaml
env:
  GITHUB_TOKEN: {% raw %}${{ secrets.GITHUB_TOKEN }}{% endraw %}
```

## Métriques Clés

### 🎯 Métriques à surveiller

1. **Coverage**: ≥ 80%
2. **Duplications**: ≤ 3%
3. **Maintainability Rating**: A ou B
4. **Reliability Rating**: A
5. **Security Rating**: A
6. **Technical Debt**: < 5% du temps de développement
7. **Code Smells**: < 10 par 1000 LOC
8. **Bugs**: 0 (blocker/critical)
9. **Vulnerabilities**: 0 (blocker/critical)
10. **Security Hotspots**: Tous reviewés

### 📊 Dashboard recommandé

Créez un dashboard personnalisé avec:
- Evolution de la coverage
- Nouveaux bugs/vulnerabilities
- Dette technique
- Quality gate status par projet

## Troubleshooting

### Problèmes courants

#### "Quality Gate failed"

1. Vérifier les métriques échouées
2. Analyser les nouveaux bugs/code smells
3. Améliorer la coverage si nécessaire
4. Revoir les duplications

#### "Coverage not detected"

```bash
# Vérifier que le rapport existe
ls -la coverage/lcov.info

# Vérifier le chemin dans sonar-project.properties
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

#### "Service timeout"

```yaml
# Augmenter le timeout
timeout-minutes: 30

# Vérifier les health checks
healthcheck:
  interval: 10s
  timeout: 10s
  retries: 30
  start_period: 60s
```

## Resources

### Documentation officielle
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [SonarQube Scanner](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/)
- [Quality Gates](https://docs.sonarqube.org/latest/user-guide/quality-gates/)

### Communauté
- [SonarSource Community](https://community.sonarsource.com/)
- [GitHub Discussions](https://github.com/SonarSource/sonarqube/discussions)

### Plugins utiles
- [SonarJS](https://github.com/SonarSource/SonarJS)
- [SonarTS](https://github.com/SonarSource/SonarTS)
- [SonarSecurity](https://www.sonarsource.com/products/codeanalyzers/sonarsecurity.html)
