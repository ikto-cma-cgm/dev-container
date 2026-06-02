# WebdriverIO E2E Tests - ${{ values.projectName }}

## 🎯 Mode: Managed Service

Ce projet utilise le **service WebdriverIO centralisé** maintenu par l'équipe Plateforme Qualité.

**Avantages** :
- ✅ Zéro configuration locale nécessaire
- ✅ Mises à jour automatiques du service
- ✅ Support et maintenance assurés
- ✅ Empreinte minimale sur votre poste

## 🚀 Quick Start

### Prérequis

- Docker Desktop installé ([Installation](https://docs.docker.com/desktop/))
- C'est tout ! Node.js, Chrome et WebdriverIO sont dans l'image Docker

### 1. Installer (optionnel pour rapports Allure)

```bash
cd webdriver-io
npm install  # Installe uniquement allure-commandline
```

### 2. Lancer les tests

```bash
# Mode headless (recommandé pour CI)
npm test

# Mode UI (voir le navigateur)
npm run test:ui

# Mode watch (tests en continu)
npm run test:watch

# Mode debug (accès shell)
npm run test:debug
```

## 📁 Structure du Projet

```
webdriver-io/
├── tests/                      # VOS TESTS ICI
│   └── specs/
│       └── *.e2e.js
├── wdio-config/               # Configuration optionnelle
│   └── wdio.conf.js           # (peut overrider la config de base)
├── test-results/              # Résultats (auto-généré)
├── allure-results/            # Rapports Allure (auto-généré)
├── docker-compose.yml         # Configuration Docker
├── package.json               # Scripts NPM
└── README.md                  # Ce fichier
```

## ✍️ Écrire des Tests

Créez vos tests dans `tests/specs/` :

```javascript
// tests/specs/login.e2e.js
describe('Login Page', () => {
    it('should login successfully', async () => {
        await browser.url('/login');

        await $('input[name="username"]').setValue('testuser');
        await $('input[name="password"]').setValue('password123');
        await $('button[type="submit"]').click();

        await expect(browser).toHaveUrl('/dashboard');
    });
});
```

**C'est tout !** Le service gère le reste (navigateur, reporters, screenshots, etc.).

## ⚙️ Configuration

### Variables d'environnement

Modifiez directement dans la commande :

```bash
# Changer l'URL de l'application
BASE_URL=https://staging.example.com npm test

# Mode non-headless
HEADLESS=false npm test

# Augmenter timeout
TEST_TIMEOUT=120000 npm test

# Plus de parallélisation
MAX_INSTANCES=10 npm test
```

Ou modifiez `docker-compose.yml` pour des changements permanents :

```yaml
environment:
  - BASE_URL=http://localhost:3000  # Votre URL
  - HEADLESS=true
  - MAX_INSTANCES={{ values.maxInstances }}
```

### Configuration avancée (optionnel)

Pour personnaliser davantage, créez `wdio-config/wdio.conf.js` :

```javascript
// Extends la configuration de base du service
const baseConfig = require('../config/wdio.base.conf').config;

exports.config = {
    ...baseConfig,
    // Vos personnalisations
    baseUrl: 'https://mon-app.com',
};
```

## 📊 Rapports

{% if 'allure' in values.reporters %}
### Allure Reports

```bash
# Générer et ouvrir le rapport
npm run report:allure
```

Rapports disponibles dans `allure-report/index.html`
{% endif %}

### Screenshots

Les screenshots des tests échoués sont dans `test-results/screenshots/`

### Logs

```bash
# Voir les logs en temps réel
npm run docker:logs
```

## 🔧 Commandes Utiles

```bash
# Tests
npm test                    # Lancer les tests
npm run test:ui             # Mode non-headless
npm run test:watch          # Mode watch
npm run test:debug          # Shell interactif

# Docker
npm run docker:up           # Démarrer en arrière-plan
npm run docker:down         # Arrêter
npm run docker:logs         # Voir les logs
npm run docker:clean        # Tout nettoyer

# Rapports
{% if 'allure' in values.reporters %}npm run report:allure       # Rapport Allure{% endif %}
```

## 🐛 Dépannage

### Les tests ne trouvent pas mon application

```bash
# Vérifier que l'app tourne
curl http://localhost:3000

# Si sur Linux, utiliser votre IP au lieu de localhost
BASE_URL=http://192.168.1.100:3000 npm test
```

### Chrome crash

Le `shm_size: '2gb'` dans docker-compose.yml devrait empêcher cela. Si problème persiste :

```yaml
# Dans docker-compose.yml, augmentez
shm_size: '4gb'
```

### Permissions sur test-results/

```bash
# Récupérer la propriété des fichiers
sudo chown -R $(whoami):$(whoami) test-results/
```

### Tests lents

```bash
# Augmenter la parallélisation
MAX_INSTANCES=10 npm test
```

## 📚 Documentation

- [WebdriverIO Docs](https://webdriver.io/)
- [Service Documentation](https://your-docs-url/webdriverio-service)
- [Best Practices](./WEBDRIVERIO_BEST_PRACTICES.md)

## 🆘 Support

- **Slack** : #quality-platform
- **Email** : quality-platform-team@your-company.com
- **Issues** : [Repo interne]

## 🔄 Mises à jour du Service

L'équipe Plateforme Qualité maintient le service. Pour utiliser une nouvelle version :

```bash
# Dernière version
docker-compose pull

# Version spécifique
# Modifiez dans docker-compose.yml :
image: ${{ values.serviceRegistry }}:1.2.0
```

**Note** : Le service suit le [Semantic Versioning](https://semver.org/). Voir le [CHANGELOG](https://your-docs-url/changelog) pour les nouveautés.

## ⚡ Intégration CI/CD

Le template inclut déjà un workflow GitHub Actions dans `.github/workflows/webdriverio.yml`.

Les tests tournent automatiquement :
{% if values.runOnPR %}- Sur chaque Pull Request{% endif %}
{% if values.runOnPush %}- Sur push vers main{% endif %}
{% if values.runScheduled %}- Selon le planning : `{{ values.scheduleCron }}`{% endif %}

Pas de configuration supplémentaire nécessaire !

---

**Mode** : 🎯 Managed Service (Recommandé)
**Service Version** : `${{ values.serviceVersion }}`
**Registry** : `${{ values.serviceRegistry }}`
**Maintenu par** : Équipe Plateforme Qualité
