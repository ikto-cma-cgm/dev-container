# Guide Équipe Plateforme - WebdriverIO Service

Guide de référence rapide pour l'équipe Plateforme Qualité qui maintient ce service.

## 🚀 Quick Start (Mainteneurs)

### Installation initiale

```bash
# Cloner le repo
git clone <repo-url>
cd webdriverio-service

# Construire localement
make build

# Tester
make test
```

### Commandes quotidiennes

```bash
# Construire l'image
make build

# Tester avec l'exemple
make example

# Scanner pour vulnérabilités
make scan

# Voir la version actuelle
make version

# Aide complète
make help
```

## 📦 Processus de Release

### Release PATCH (Bug fix)

```bash
# 1. Créer branche
git checkout -b hotfix/fix-something

# 2. Fix + commit
git commit -m "fix: description du bug"

# 3. Mettre à jour CHANGELOG.md
vim CHANGELOG.md

# 4. Bump version
VERSION=1.2.4 make release REGISTRY=your-registry.com

# 5. Tag et push
git tag -a v1.2.4 -m "Fix: description"
git push origin v1.2.4

# 6. Message Slack
# "📦 WebdriverIO Service v1.2.4 - Bug fixes. Changelog: [link]"
```

### Release MINOR (Nouvelles fonctionnalités)

```bash
# 1. Créer branche
git checkout -b feature/add-firefox-support

# 2. Développement + tests
# ... développement ...
make test

# 3. Tester avec projets pilotes
# ... tests sur 2-3 projets réels ...

# 4. Update docs + CHANGELOG
vim README.md CHANGELOG.md

# 5. Annonce 1 semaine avant
# Message Slack: "🔜 WebdriverIO v1.3.0 arrive la semaine prochaine avec support Firefox"

# 6. Release (1 semaine plus tard)
VERSION=1.3.0 make release REGISTRY=your-registry.com

# 7. Tag et push
git tag -a v1.3.0 -m "feat: Add Firefox support"
git push origin v1.3.0

# 8. Communication
# Slack + mise à jour docs
```

### Release MAJOR (Breaking changes)

```bash
# ⚠️ Processus plus lourd, voir VERSIONING.md

# Timeline: 3 semaines minimum
# Semaine 1: Annonce + guide de migration
# Semaine 2-3: Accompagnement équipes
# Semaine 4: Release

VERSION=2.0.0 make release REGISTRY=your-registry.com
```

## 🔧 Maintenance Courante

### Calendrier mensuel

**1er mardi du mois - Maintenance :**

```bash
# 1. Check dépendances
npm outdated

# 2. Update sécurité (si nécessaire)
npm audit
npm audit fix

# 3. Rebuild et test
make build
make test

# 4. Release PATCH si updates
VERSION=1.2.5 make release REGISTRY=your-registry.com
```

### Répondre à une issue

```bash
# 1. Reproduire localement
cd examples/minimal-project
docker-compose up wdio-tests

# 2. Debug interactif
make test-shell

# 3. Fix et test
make test

# 4. Release si critique
```

## 🐛 Dépannage Commun

### Build échoue

```bash
# Clean et rebuild
make clean
docker system prune -f
make build

# Check Docker
docker info
docker buildx ls
```

### Tests échouent

```bash
# Mode debug
cd examples/minimal-project
docker-compose run --rm wdio-tests bash

# Dans le container
ls -la tests/
npm run test:e2e
```

### Multi-platform build ne marche pas

```bash
# Setup buildx
docker buildx create --use
docker buildx inspect --bootstrap

# Rebuild
make build-multi
```

## 📊 Monitoring

### Métriques à surveiller

1. **Adoption** : Combien de projets utilisent le service ?
2. **Versions** : Distribution des versions utilisées
3. **Issues** : Nombre d'issues par version
4. **Build time** : Temps de build de l'image
5. **Image size** : Taille de l'image Docker

```bash
# Check taille image
docker images webdriverio-service:latest

# Si trop grosse (>1GB), optimiser
```

### Logs CI/CD

```bash
# GitHub Actions
# https://github.com/<org>/<repo>/actions

# Check status
gh workflow list
gh run list
```

## 🤝 Support Développeurs

### Questions fréquentes

**Q: "Les tests ne trouvent pas mon app"**
```bash
# Vérifier host.docker.internal
# Si Windows/Mac: devrait marcher
# Si Linux: utiliser --add-host ou IP machine
```

**Q: "Chrome crash dans Docker"**
```bash
# Augmenter shm_size
shm_size: '4gb'

# Ou ajouter flags Chrome
--disable-dev-shm-usage
```

**Q: "Permissions sur test-results/"**
```bash
# Image utilise user 1000:1000
# Fix:
sudo chown -R $(whoami):$(whoami) test-results/
```

### Office Hours

**Quand :** Mardi 10h-11h
**Où :** Slack #quality-platform ou Zoom

**Préparer :**
- Liste des questions/issues
- Exemples de projets problématiques
- Logs d'erreurs

## 📝 Checklist Avant Vacation

Avant de partir en vacances, assurer la continuité :

- [ ] Documentation à jour
- [ ] Pas de PR critiques en attente
- [ ] Version stable publiée
- [ ] Passer le relais à quelqu'un
- [ ] Message dans #quality-platform

```markdown
🏖️ @backup-person prend le relais sur WebdriverIO Service
Contactez-le/la pour toute urgence.
Retour le [date].
```

## 🔐 Accès et Permissions

### Nécessaire pour maintenir le service

- [ ] Accès repo Git
- [ ] Accès registry Docker (push)
- [ ] Accès Slack webhook (notifications)
- [ ] Accès GitHub Actions secrets
- [ ] Admin sur #quality-platform

### Onboarding nouveau membre

```bash
# 1. Clone et setup
git clone <repo>
make build
make test

# 2. Accès
# - Ajouter au repo (Write)
# - Ajouter au registry
# - Inviter à #quality-platform

# 3. Documentation
# Lire: README.md, VERSIONING.md, ce guide

# 4. Premier PR (accompagné)
# Fix documentation ou petit bug
```

## 📚 Ressources

### Documentation interne
- README.md - Guide utilisateurs
- VERSIONING.md - Stratégie de versions
- CHANGELOG.md - Historique
- Ce guide - Référence mainteneurs

### Externe
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [WebdriverIO Docs](https://webdriver.io/)
- [Semantic Versioning](https://semver.org/)

### Contacts
- Slack: #quality-platform
- Email: quality-platform-team@company.com
- On-call: voir PagerDuty

## 🎯 Objectifs 2026

- [ ] Support Firefox et Edge
- [ ] Réduire taille image de 20%
- [ ] 95% des projets sur version N ou N-1
- [ ] < 3 jours pour adoption MINOR
- [ ] Satisfaction équipes > 8.5/10
- [ ] Documentation vidéo
- [ ] Template Backstage amélioré

## 💡 Améliorations Futures

**Court terme (Q1 2026) :**
- [ ] Support TypeScript dans tests
- [ ] Ajout Percy pour visual regression
- [ ] Métriques de performance intégrées

**Moyen terme (Q2-Q3 2026) :**
- [ ] Service Selenium Grid mutualisé
- [ ] Dashboard Allure centralisé
- [ ] CLI wrapper pour simplifier usage

**Long terme (Q4 2026+) :**
- [ ] Support multi-browsers (Firefox, Edge, Safari)
- [ ] Integration BrowserStack/Sauce Labs
- [ ] Service de test à la demande (on-demand)

---

## 🆘 Urgences

### Critique (Production down)

```bash
# 1. Rollback immédiat
docker pull your-registry/webdriverio-service:1.2.3  # version stable
docker tag ... :latest  # revert latest

# 2. Communication immédiate
# Slack #quality-platform + #incidents

# 3. Hotfix en // du rollback
git checkout -b hotfix/critical-fix

# 4. Post-mortem après résolution
```

### Contact escalade
- Lead: @lead-person
- CTO: @cto (si vraiment critique)
- DevOps: #devops-help

---

**Dernière mise à jour :** 2026-01-09
**Mainteneur actuel :** [Nom]
**Backup :** [Nom]
