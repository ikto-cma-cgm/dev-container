# Guide de Migration - Template WebdriverIO v2.0

## 🎯 Nouveautés

La version 2.0 du template introduit **deux modes de configuration** :

- **Managed Service** (Nouveau) : Utilise une image Docker centralisée
- **Self-Managed** (Existant) : Configuration complète comme avant

## 📊 Pour Qui ?

### Vous avez déjà un projet WebdriverIO généré avec l'ancien template ?

Ce guide vous concerne ! Vous avez **deux options** :

1. **Rester en Self-Managed** (aucun changement nécessaire)
2. **Migrer vers Managed Service** (recommandé pour simplicité)

## 🔄 Option 1: Rester en Self-Managed (Zéro effort)

### Avantages
- ✅ Aucun changement nécessaire
- ✅ Votre configuration existante continue de fonctionner
- ✅ Contrôle total

### Actions
**Aucune !** Votre projet continue de fonctionner exactement comme avant.

Le template v2.0 génère la même configuration que v1.x quand on choisit `self-managed`.

---

## 🚀 Option 2: Migrer vers Managed Service (Recommandé)

### Avantages
- ✅ Configuration simplifiée
- ✅ Mises à jour automatiques du service
- ✅ Moins de fichiers à maintenir
- ✅ Support de l'équipe Plateforme Qualité

### Checklist de Migration

#### 1. Pré-migration (Préparation)

- [ ] Sauvegarder votre dossier `webdriver-io/`
  ```bash
  cp -r webdriver-io webdriver-io.backup
  ```

- [ ] Lister vos personnalisations
  - Avez-vous modifié `Dockerfile.wdio` ?
  - Avez-vous modifié `wdio.conf.js` ?
  - Avez-vous des dépendances custom dans `package.json` ?

- [ ] Vérifier les tests
  ```bash
  npm run test:e2e  # Assurez-vous que tout passe
  ```

#### 2. Migration (15 minutes)

**Étape 1 : Générer la nouvelle config**

1. Aller dans Backstage
2. Utiliser le template WebdriverIO v2.0
3. Choisir **Managed Service Mode**
4. Configurer :
   - Project Name : `<votre-projet>`
   - Service Version : `latest` ou `1.0.0` (stable)
   - Autres options : similaires à votre config actuelle

5. Créer la PR

**Étape 2 : Copier vos tests**

```bash
# Depuis votre backup
cp -r webdriver-io.backup/tests/* webdriver-io/tests/
```

**Étape 3 : Migrer les personnalisations** (si applicable)

Si vous aviez des personnalisations dans `wdio.conf.js` :

```bash
# Créer la config personnalisée
mkdir -p webdriver-io/wdio-config
```

```javascript
// webdriver-io/wdio-config/wdio.conf.js
const baseConfig = require('../config/wdio.base.conf').config;

exports.config = {
    ...baseConfig,
    // VOS PERSONNALISATIONS ICI
    // (copiez depuis votre ancien wdio.conf.js)
};
```

**Étape 4 : Tester**

```bash
cd webdriver-io

# Installer (juste allure, très léger)
npm install

# Tester
npm test
```

**Étape 5 : Nettoyer**

Si tout fonctionne, supprimez les anciens fichiers :

```bash
# Ces fichiers ne sont plus nécessaires en mode Managed
git rm Dockerfile.wdio  # Si présent
git rm wdio-config/docker-compose.wdio.yml  # Si présent
```

#### 3. Post-migration (Vérification)

- [ ] Les tests passent : `npm test`
- [ ] CI/CD fonctionne
- [ ] Screenshots générés en cas d'échec
- [ ] Rapports Allure fonctionnent (si utilisés)
- [ ] Documentation mise à jour (si README personnalisé)

## 📋 Mapping de Configuration

| Ancien (v1.x) | Nouveau (Managed Service) |
|---------------|---------------------------|
| `Dockerfile.wdio` | ❌ Supprimé (utilise l'image centrale) |
| `package.json` (15+ dépendances) | Simplifié (1 dépendance) |
| `npm run test:e2e` | `npm test` |
| `docker-compose.yml` (complexe) | `docker-compose.yml` (simple) |
| `wdio.conf.js` | Optionnel via `wdio-config/` |

## 🐛 Problèmes Courants et Solutions

### Problème 1: Personnalisations Chrome Options

**Ancien** :
```javascript
// wdio.conf.js
capabilities: [{
    'goog:chromeOptions': {
        args: ['--disable-web-security']
    }
}]
```

**Solution** :
```javascript
// wdio-config/wdio.conf.js
const baseConfig = require('../config/wdio.base.conf').config;

exports.config = {
    ...baseConfig,
    capabilities: [{
        ...baseConfig.capabilities[0],
        'goog:chromeOptions': {
            ...baseConfig.capabilities[0]['goog:chromeOptions'],
            args: [
                ...baseConfig.capabilities[0]['goog:chromeOptions'].args,
                '--disable-web-security'  // Votre ajout
            ]
        }
    }]
};
```

### Problème 2: Dépendance custom (ex: moment.js)

**Solution** :
```json
// package.json - ajouter vos dépendances
{
  "devDependencies": {
    "allure-commandline": "^2.29.0",
    "moment": "^2.30.0"  // Votre ajout
  }
}
```

### Problème 3: Scripts npm personnalisés

**Solution** :
```json
// package.json - ajouter vos scripts
{
  "scripts": {
    "test": "docker-compose up --abort-on-container-exit wdio-tests",
    "test:smoke": "BASE_URL=https://prod.com npm test",  // Votre ajout
    "test:custom": "..."  // Autres scripts
  }
}
```

### Problème 4: Plugins WebdriverIO custom

Si vous utilisez un plugin non inclus dans le service :

**Option A** : Demander son ajout au service (via #quality-platform)

**Option B** : Rester en mode Self-Managed

## 📈 Comparaison Avant/Après

### Avant (Self-Managed)

```bash
webdriver-io/
├── Dockerfile.wdio         # 40 lignes
├── docker-compose.yml      # 150 lignes
├── package.json            # 15+ dépendances WDIO
├── wdio.conf.js           # 200 lignes
└── tests/                  # Vos tests

Total: ~500 lignes de config à maintenir
```

### Après (Managed Service)

```bash
webdriver-io/
├── docker-compose.yml      # 30 lignes (simplifié)
├── package.json            # 1 dépendance (allure)
├── wdio-config/           # Optionnel si besoin
│   └── wdio.conf.js       # Seulement vos overrides
└── tests/                  # Vos tests (inchangés)

Total: ~50 lignes de config à maintenir
```

**Réduction** : ~90% de configuration ! 🎉

## 🎓 Exemples de Migration

### Exemple 1 : Projet Simple

**Avant** :
- Tests E2E basiques
- Chrome headless
- Pas de personnalisation

**Migration** : 5 minutes
1. Générer en Managed Service
2. Copier les tests
3. `npm test`
✅ Terminé !

### Exemple 2 : Projet avec Personnalisations

**Avant** :
- Tests E2E complexes
- Custom Chrome flags
- Helper functions custom
- Selenium Grid

**Migration** : 15 minutes
1. Générer en Managed Service
2. Copier les tests
3. Créer `wdio-config/wdio.conf.js` avec overrides
4. Copier helpers dans `tests/helpers/`
5. Tester
✅ Fonctionne avec le service !

### Exemple 3 : Projet Très Personnalisé

**Avant** :
- Plugins WebdriverIO custom
- Dockerfile hautement personnalisé
- Dépendances système spécifiques

**Recommandation** : Rester en Self-Managed
Ou contacter #quality-platform pour discuter l'ajout au service.

## 💬 Support Migration

### Besoin d'aide ?

**Option 1 : Documentation**
- [Guide de Configuration](./TEMPLATE_CONFIGURATION_GUIDE.md)
- [README du Service](../webdriverio-service/README.md)

**Option 2 : Office Hours**
- Mardi 10h-11h sur Slack #quality-platform
- Session de migration assistée

**Option 3 : Contact direct**
- Slack : #quality-platform
- Email : quality-platform-team@your-company.com

### Migration assistée

L'équipe Plateforme Qualité propose :
- 🤝 Session de migration en pair programming (30 min)
- 📝 Revue de votre config existante
- 🚀 Accompagnement personnalisé

**Réserver** : Message sur #quality-platform

## ✅ Checklist Finale

Avant de merger votre PR de migration :

- [ ] Les tests passent : `npm test`
- [ ] CI/CD passe
- [ ] Rapports générés correctement
- [ ] README mis à jour (si personnalisé)
- [ ] Équipe informée du changement
- [ ] Ancien backup supprimé après quelques jours de stabilité

## 🎯 Roadmap du Service

### Déjà disponible (v1.0.0)
- ✅ Chrome headless
- ✅ Rapports Allure, JUnit, Spec
- ✅ Screenshots auto
- ✅ Multi-platform (Mac/Linux/Windows)

### Bientôt (v1.1.0 - Q2 2026)
- 🔜 Firefox support
- 🔜 Edge support
- 🔜 Percy visual regression
- 🔜 Métriques de performance

### Futur (v2.0.0 - Q4 2026)
- 🔮 Selenium Grid mutualisé
- 🔮 Dashboard Allure centralisé
- 🔮 BrowserStack integration

## 📊 Retour d'expérience

Partagez votre migration :
- Combien de temps ?
- Difficultés rencontrées ?
- Suggestions d'amélioration ?

→ Survey post-migration : [lien]

---

**Questions fréquentes** : Voir [FAQ](./TEMPLATE_CONFIGURATION_GUIDE.md#faq)

**Date de publication** : 2026-01-09
**Version du template** : 2.0.0
