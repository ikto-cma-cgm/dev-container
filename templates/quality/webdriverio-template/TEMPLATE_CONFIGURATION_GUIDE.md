# Guide de Configuration du Template WebdriverIO

## 🎯 Vue d'ensemble

Le template WebdriverIO propose maintenant **deux modes de configuration** :

### 1. **Managed Service Mode** (Recommandé) 🌟

- Utilise l'image Docker centralisée maintenue par l'équipe Plateforme Qualité
- Configuration minimale
- Mises à jour automatiques
- Zéro dépendances locales

### 2. **Self-Managed Mode**

- Génère une configuration complète avec Dockerfile
- Contrôle total de la configuration
- Maintenance à la charge de l'équipe projet

## 📋 Paramètres de Configuration

### Nouveaux Paramètres (Service Mode)

#### `serviceMode` (requis)
- **Type**: String
- **Options**:
  - `managed-service` (Recommandé) - Utilise le service centralisé
  - `self-managed` - Génère configuration complète
- **Default**: `managed-service`

#### `serviceRegistry` (optionnel, managed-service only)
- **Type**: String
- **Default**: `ghcr.io/your-org/webdriverio-service`
- **Description**: Registry Docker contenant l'image du service

#### `serviceVersion` (optionnel, managed-service only)
- **Type**: String
- **Options**:
  - `latest` - Toujours la dernière version
  - `1.0.0` - Version stable spécifique
  - `1.x` - Dernière version 1.x (auto-update minor)
- **Default**: `latest`

## 🔄 Fichiers Générés par Mode

### Mode Managed Service

```
webdriver-io/
├── docker-compose.yml         # Simplifié, référence le service
├── package.json               # Scripts NPM simplifiés (pas de dépendances WDIO)
├── tests/                     # Structure de tests
│   └── specs/
├── wdio-config/              # Configuration optionnelle
├── .github/workflows/        # CI/CD configuré
└── README.md                 # Documentation mode managed
```

**Fichiers NON générés** :
- ❌ `Dockerfile.wdio` (utilise l'image centralisée)
- ❌ Dépendances WebdriverIO dans package.json

### Mode Self-Managed

```
webdriver-io/
├── docker-compose.yml         # Configuration complète avec Selenium Grid
├── Dockerfile.wdio           # ✅ Dockerfile personnalisé
├── package.json              # ✅ Toutes les dépendances WebdriverIO
├── tests/
├── wdio-config/
│   ├── wdio.conf.js
│   └── docker-compose.wdio.yml  # Grid Selenium séparé
├── .github/workflows/
└── README.md
```

## 💡 Recommandations par Cas d'Usage

### Utilisez **Managed Service** si :
- ✅ Vous voulez démarrer rapidement
- ✅ Vous n'avez pas besoin de personnalisation avancée
- ✅ Vous préférez déléguer la maintenance
- ✅ Vous voulez bénéficier des mises à jour automatiques
- ✅ Vous voulez minimiser les dépendances du projet

### Utilisez **Self-Managed** si :
- ⚙️ Vous avez besoin de personnalisation très spécifique
- ⚙️ Vous voulez contrôler totalement l'environnement
- ⚙️ Vous avez des contraintes de sécurité nécessitant un contrôle total
- ⚙️ Vous voulez épingler des versions très spécifiques de dépendances

## 🎨 Exemples de Configuration

### Exemple 1: Projet Standard (Managed Service)

```yaml
# Configuration dans Backstage
serviceMode: managed-service
serviceRegistry: ghcr.io/your-org/webdriverio-service
serviceVersion: latest
baseUrl: http://localhost:3000
browsers: [chrome]
headless: true
```

**Résultat** :
- docker-compose.yml simple
- package.json minimal (juste allure-commandline)
- Prêt en 2 minutes

### Exemple 2: Projet avec Besoins Spécifiques (Self-Managed)

```yaml
# Configuration dans Backstage
serviceMode: self-managed
baseUrl: http://localhost:3000
browsers: [chrome, firefox, edge]
executionMode: docker
dockerizeRunner: true
```

**Résultat** :
- Dockerfile.wdio personnalisé
- Selenium Grid avec multi-browsers
- Contrôle total de la configuration

## 🔧 Migration entre Modes

### De Self-Managed vers Managed Service

1. **Sauvegarder vos tests** (le code des tests est identique)
2. **Re-générer** avec le template en mode `managed-service`
3. **Copier** vos tests dans le nouveau projet
4. **Adapter** si vous aviez des personnalisations (via wdio-config/)

### De Managed Service vers Self-Managed

1. **Re-générer** avec le template en mode `self-managed`
2. **Copier** vos tests
3. **Personnaliser** le Dockerfile.wdio si nécessaire

## 📊 Comparaison Détaillée

| Aspect | Managed Service | Self-Managed |
|--------|----------------|--------------|
| **Setup Time** | 2 minutes | 10-15 minutes |
| **Maintenance** | Équipe Plateforme | Équipe Projet |
| **Mises à jour** | Automatiques | Manuelles |
| **Taille package.json** | ~50 lignes | ~200 lignes |
| **Dépendances locales** | 1 (allure) | 15+ |
| **Flexibilité** | Moyenne | Totale |
| **Complexité** | Faible | Moyenne-Haute |
| **Support** | Équipe Plateforme | Communauté |

## 🚀 Workflow Recommandé

### Pour Nouveaux Projets

```
1. Démarrer avec Managed Service
   ↓
2. Développer et tester
   ↓
3. Si besoin de personnalisation avancée
   → Migrer vers Self-Managed
   ↓
4. Sinon → Profiter du service ! ✅
```

### Pour Projets Existants

Si vous avez déjà WebdriverIO :

```
1. Évaluer vos besoins de personnalisation
   ↓
2. Si personnalisation minimale → Managed Service
   Si personnalisation forte → Self-Managed
   ↓
3. Générer via le template
   ↓
4. Copier vos tests existants
   ↓
5. Tester et ajuster
```

## 📝 Variables d'Environnement (Managed Service)

Le mode Managed Service supporte ces variables :

```bash
# Application
BASE_URL=http://localhost:3000

# Browser
BROWSER=chrome              # chrome, firefox, edge
HEADLESS=true              # true/false

# Parallelization
MAX_INSTANCES=5            # Nombre de tests parallèles

# Timeouts
TEST_TIMEOUT=60000         # Timeout par test (ms)

# Logging
LOG_LEVEL=info             # trace, debug, info, warn, error

# Framework
TEST_FRAMEWORK=mocha       # mocha, jasmine, cucumber
```

## 🆘 FAQ

### Q: Puis-je changer de mode après génération ?
**R:** Oui, mais nécessite une re-génération. Sauvegardez vos tests d'abord.

### Q: Le mode Managed supporte-t-il tous les navigateurs ?
**R:** Actuellement Chrome uniquement. Firefox et Edge prévus en v1.1.0.

### Q: Puis-je personnaliser en mode Managed ?
**R:** Oui, via `wdio-config/wdio.conf.js` qui override la config de base.

### Q: Comment savoir quelle version du service j'utilise ?
**R:** Regardez dans `docker-compose.yml` la ligne `image:` ou lancez :
```bash
docker-compose run --rm wdio-tests node --version
```

### Q: Le service est-il mis à jour automatiquement ?
**R:** Si vous utilisez `latest`, oui (pull à chaque lancement). Pour stabilité, épinglez une version spécifique.

### Q: Que se passe-t-il si le service a un bug ?
**R:** L'équipe Plateforme publie des hotfixes rapidement. En urgence, épinglez une version antérieure stable.

## 📚 Ressources

- [README du Service](../webdriverio-service/README.md)
- [Guide de Versioning](../webdriverio-service/VERSIONING.md)
- [Changelog du Service](../webdriverio-service/CHANGELOG.md)
- [WebdriverIO Docs](https://webdriver.io/)

## 💬 Support

- **Managed Service** : #quality-platform (Slack)
- **Self-Managed** : Documentation projet + communauté
- **Général** : quality-platform-team@your-company.com

---

**Dernière mise à jour** : 2026-01-09
**Version du template** : 2.0.0
**Ajout du mode Managed Service**
