# WebdriverIO Testing Service

Service centralisé de tests E2E maintenu par l'équipe Plateforme Qualité.

## 🎯 Objectif

Fournir un environnement de test WebdriverIO **pré-configuré et dockerisé** qui permet aux développeurs de :
- ✅ Se concentrer sur l'écriture de tests, pas sur la configuration
- ✅ Avoir une empreinte minimale sur leur poste (tout tourne en Docker)
- ✅ Garantir la cohérence entre les environnements (dev, CI/CD)
- ✅ Supporter Mac (Intel/M1/M2), Linux et Windows

## 🚀 Quick Start

### Prérequis

- Docker Desktop installé ([Mac](https://docs.docker.com/desktop/install/mac-install/) | [Linux](https://docs.docker.com/desktop/install/linux-install/) | [Windows](https://docs.docker.com/desktop/install/windows-install/))
- C'est tout ! Node.js, Chrome et WebdriverIO sont inclus dans l'image

### 1. Créer votre structure de tests

```bash
my-project/
├── tests/
│   └── specs/
│       └── mon-test.e2e.js
├── wdio-config/
│   └── wdio.conf.js (optionnel)
└── docker-compose.yml
```

### 2. Créer votre docker-compose.yml

```yaml
version: '3.8'

services:
  wdio-tests:
    image: your-registry/webdriverio-service:latest
    volumes:
      - ./tests:/tests/tests:ro
      - ./wdio-config:/tests/wdio-config:ro
      - ./test-results:/tests/test-results:rw
      - ./allure-results:/tests/allure-results:rw
    environment:
      - BASE_URL=http://host.docker.internal:3000
      - HEADLESS=true
    extra_hosts:
      - "host.docker.internal:host-gateway"
    shm_size: '2gb'
```

### 3. Lancer vos tests

```bash
# Démarrer les tests
docker-compose up wdio-tests

# Ou en mode interactif
docker-compose run --rm wdio-tests bash
```

## 📦 Construire l'image

### Construction simple

```bash
# Construire l'image
docker build -t webdriverio-service:latest .

# Construire pour multi-plateformes (Mac M1, Intel, Linux)
docker buildx build --platform linux/amd64,linux/arm64 -t webdriverio-service:latest .
```

### Publication sur un registry

```bash
# Tag avec version
docker tag webdriverio-service:latest your-registry.com/webdriverio-service:1.0.0
docker tag webdriverio-service:latest your-registry.com/webdriverio-service:latest

# Push
docker push your-registry.com/webdriverio-service:1.0.0
docker push your-registry.com/webdriverio-service:latest
```

## 💻 Utilisation

### Mode 1: Docker Compose (Recommandé)

Le plus simple pour une utilisation locale.

```bash
# Lancer les tests
docker-compose up wdio-tests

# Avec variables d'environnement personnalisées
BASE_URL=https://staging.example.com docker-compose up wdio-tests

# Mode interactif pour debug
docker-compose run --rm wdio-tests bash
```

### Mode 2: Docker Run (Flexibilité maximale)

```bash
# Lancer les tests
docker run --rm \
  -v $(pwd)/tests:/tests/tests:ro \
  -v $(pwd)/test-results:/tests/test-results:rw \
  -e BASE_URL=http://localhost:3000 \
  -e HEADLESS=true \
  webdriverio-service:latest

# Accès shell pour debug
docker run --rm -it \
  -v $(pwd)/tests:/tests/tests:ro \
  webdriverio-service:latest bash
```

### Mode 3: Utilisation en CI/CD

#### GitHub Actions

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run E2E Tests
        run: |
          docker run --rm \
            -v ${{ github.workspace }}/tests:/tests/tests:ro \
            -v ${{ github.workspace }}/test-results:/tests/test-results:rw \
            -e BASE_URL=${{ secrets.BASE_URL }} \
            -e HEADLESS=true \
            your-registry/webdriverio-service:latest

      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

#### GitLab CI

```yaml
e2e-tests:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker pull your-registry/webdriverio-service:latest
    - |
      docker run --rm \
        -v $CI_PROJECT_DIR/tests:/tests/tests:ro \
        -v $CI_PROJECT_DIR/test-results:/tests/test-results:rw \
        -e BASE_URL=$BASE_URL \
        -e HEADLESS=true \
        your-registry/webdriverio-service:latest
  artifacts:
    when: always
    paths:
      - test-results/
    reports:
      junit: test-results/*.xml
```

## ⚙️ Configuration

### Variables d'environnement

| Variable | Défaut | Description |
|----------|--------|-------------|
| `BASE_URL` | `http://localhost:3000` | URL de base de l'application |
| `BROWSER` | `chrome` | Navigateur à utiliser |
| `HEADLESS` | `true` | Mode headless |
| `MAX_INSTANCES` | `5` | Nombre de tests parallèles |
| `TEST_TIMEOUT` | `60000` | Timeout par test (ms) |
| `LOG_LEVEL` | `info` | Niveau de log (trace, debug, info, warn, error) |
| `BAIL` | `false` | Arrêter à la première erreur |

### Configuration personnalisée

Créez un fichier `wdio-config/wdio.conf.js` :

```javascript
const baseConfig = require('../config/wdio.base.conf').config;

exports.config = {
    ...baseConfig,
    // Vos personnalisations
    baseUrl: 'https://mon-app.com',
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--disable-web-security']
        }
    }]
};
```

## 📊 Rapports

### Allure Reports

Les rapports Allure sont générés automatiquement dans `allure-results/`.

```bash
# Générer et ouvrir le rapport (nécessite allure-commandline local)
npm install -g allure-commandline
allure generate allure-results --clean -o allure-report
allure open allure-report
```

### JUnit XML

Les rapports JUnit sont dans `test-results/*.xml` et compatibles avec tous les systèmes CI/CD.

## 🖥️ Compatibilité Multi-plateforme

### Mac (Intel et M1/M2)

```bash
# Docker Desktop gère automatiquement l'architecture
docker-compose up wdio-tests
```

### Linux

```bash
# Identique à Mac
docker-compose up wdio-tests
```

### Windows (PowerShell)

```powershell
# Utiliser PowerShell (pas CMD)
docker-compose up wdio-tests

# Ou Docker Run avec chemins Windows
docker run --rm `
  -v ${PWD}/tests:/tests/tests:ro `
  -v ${PWD}/test-results:/tests/test-results:rw `
  webdriverio-service:latest
```

**Note Windows** : Assurez-vous que Docker Desktop utilise WSL2 backend pour de meilleures performances.

## 🔧 Dépannage

### Les tests ne trouvent pas mon application

```bash
# Vérifier que host.docker.internal fonctionne
docker run --rm --add-host=host.docker.internal:host-gateway alpine ping -c 1 host.docker.internal

# Alternative : utiliser l'IP de votre machine
docker run --rm -e BASE_URL=http://192.168.1.100:3000 ...
```

### Erreur "Chrome crashed"

```yaml
# Augmenter la mémoire partagée dans docker-compose.yml
services:
  wdio-tests:
    shm_size: '2gb'  # ou plus
```

### Permissions sur les fichiers de résultats

```bash
# Les fichiers appartiennent à l'utilisateur 1000 (wdio)
# Pour récupérer la propriété :
sudo chown -R $(whoami):$(whoami) test-results/
```

### Mode debug interactif

```bash
# Accéder au shell du container
docker-compose run --rm wdio-tests bash

# Une fois dans le container
ls -la tests/  # Vérifier les tests montés
npm run test:e2e  # Lancer manuellement
```

## 📚 Structure recommandée

```
your-project/
├── tests/
│   ├── specs/              # Vos tests
│   │   ├── login/
│   │   │   └── login.e2e.js
│   │   └── checkout/
│   │       └── checkout.e2e.js
│   ├── pageobjects/        # Page Objects (optionnel)
│   │   └── login.page.js
│   └── helpers/            # Utilitaires (optionnel)
│       └── api-helper.js
├── wdio-config/
│   └── wdio.conf.js        # Config personnalisée (optionnel)
├── test-results/           # Générés automatiquement
├── allure-results/         # Générés automatiquement
└── docker-compose.yml      # Configuration Docker
```

## 🔄 Mise à jour du service

L'équipe Plateforme Qualité maintient et met à jour l'image régulièrement.

```bash
# Récupérer la dernière version
docker pull your-registry/webdriverio-service:latest

# Ou une version spécifique
docker pull your-registry/webdriverio-service:1.2.0
```

### Stratégie de versioning

- `latest` : Dernière version stable (peut contenir breaking changes)
- `1.x` : Version majeure (breaking changes entre 1.x et 2.x)
- `1.2.x` : Version mineure (nouvelles fonctionnalités, pas de breaking changes)
- `1.2.3` : Version patch (bug fixes uniquement)

**Recommandation** : Épinglez une version mineure en production (`1.2.x`) et testez `latest` en dev.

## 🤝 Support

- **Documentation** : Ce fichier et [CHANGELOG.md](./CHANGELOG.md)
- **Issues** : Ouvrir un ticket sur le repo interne
- **Slack** : #quality-platform
- **Équipe** : quality-platform-team@your-company.com

## 📋 Exemple complet

Voir le dossier `examples/minimal-project/` pour un projet de démarrage complet.

```bash
# Tester l'exemple
cd examples/minimal-project
docker-compose up wdio-tests
```

## 🎓 Ressources

- [WebdriverIO Documentation](https://webdriver.io/)
- [Best Practices](https://webdriver.io/docs/bestpractices)
- [API Reference](https://webdriver.io/docs/api)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
