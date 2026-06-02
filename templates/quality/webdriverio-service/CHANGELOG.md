# Changelog

Toutes les modifications notables de ce service seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Unreleased]

### En cours
- Rien pour le moment

## [1.0.0] - 2026-01-09

### Ajouté
- Image Docker centrale pour WebdriverIO
- Support multi-plateforme (Mac Intel/M1/M2, Linux, Windows)
- Configuration de base pré-configurée
- Support Chromium headless
- Rapports Allure, JUnit et Spec intégrés
- Variables d'environnement pour configuration flexible
- Exemple de projet minimal
- Documentation complète
- Entrypoint script pour faciliter l'utilisation
- Healthcheck Docker
- Support pour tests parallèles
- Screenshots automatiques en cas d'échec

### Configuration incluse
- Node.js 18
- WebdriverIO 8.40.0
- Chromium + ChromeDriver
- Reporters : Allure, JUnit, JSON, Spec
- Frameworks de test : Mocha, Jasmine, Cucumber
- Chai pour les assertions
- Support Babel pour ES6+

## Stratégie de versioning

### Format : MAJOR.MINOR.PATCH

#### MAJOR (1.x.x → 2.x.x)
**Breaking changes** - Nécessite des modifications dans les projets utilisant le service

Exemples :
- Changement de version majeure de Node.js (18 → 20)
- Changement de version majeure de WebdriverIO (8 → 9)
- Modification de la structure des volumes
- Changement de l'API de configuration
- Suppression de fonctionnalités obsolètes

#### MINOR (x.1.x → x.2.x)
**Nouvelles fonctionnalités** - Rétro-compatible

Exemples :
- Ajout de nouveaux navigateurs (Firefox, Edge)
- Nouveaux reporters
- Nouvelles variables d'environnement
- Amélioration des performances
- Ajout d'utilitaires ou helpers

#### PATCH (x.x.1 → x.x.2)
**Bug fixes** - Rétro-compatible

Exemples :
- Correction de bugs
- Mises à jour de sécurité
- Petites améliorations de documentation
- Optimisations mineures

## Migration Guides

### Migration vers 2.x (futur)

_Sera documenté lors de la release 2.0.0_

## Notes de release

### 1.0.0
Première version stable du service WebdriverIO dockerisé.

**Fonctionnalités principales :**
- Environnement de test complet et prêt à l'emploi
- Zéro configuration locale nécessaire
- Compatible tous OS
- Intégration CI/CD simplifiée

**Pour commencer :**
```bash
docker pull your-registry/webdriverio-service:1.0.0
```

Voir [README.md](./README.md) pour la documentation complète.
