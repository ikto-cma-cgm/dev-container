# Guide de Versioning et Maintenance

Guide pour l'équipe Plateforme Qualité sur la gestion des versions du service WebdriverIO.

## 📋 Table des matières

1. [Stratégie de versioning](#stratégie-de-versioning)
2. [Processus de release](#processus-de-release)
3. [Gestion des dépendances](#gestion-des-dépendances)
4. [Communication avec les équipes](#communication-avec-les-équipes)
5. [Rétro-compatibilité](#rétro-compatibilité)

## Stratégie de versioning

Nous suivons [Semantic Versioning 2.0.0](https://semver.org/lang/fr/) :

```
MAJOR.MINOR.PATCH (ex: 1.2.3)
```

### Version MAJOR (Breaking Changes)

**Quand incrémenter :** Changements incompatibles avec les versions précédentes

**Exemples :**
- Changement de version majeure de Node.js (18 → 20)
- Changement de version majeure de WebdriverIO (8 → 9)
- Modification de la structure des volumes Docker
- Changement du format de configuration
- Suppression de variables d'environnement
- Changement de l'architecture de l'image

**Impact utilisateurs :** 🔴 **ÉLEVÉ** - Nécessite des modifications dans les projets

**Processus :**
1. Annoncer 3 semaines à l'avance
2. Fournir un guide de migration détaillé
3. Maintenir l'ancienne version majeure 6 mois minimum
4. Organiser des sessions d'accompagnement

### Version MINOR (Nouvelles fonctionnalités)

**Quand incrémenter :** Ajout de fonctionnalités rétro-compatibles

**Exemples :**
- Ajout de nouveaux navigateurs (Firefox, Edge)
- Nouveaux reporters disponibles
- Nouvelles variables d'environnement (optionnelles)
- Amélioration des performances
- Ajout d'utilitaires
- Mise à jour mineure de dépendances

**Impact utilisateurs :** 🟡 **MODÉRÉ** - Optionnel, mais recommandé

**Processus :**
1. Annoncer 1 semaine à l'avance
2. Documenter les nouvelles fonctionnalités
3. Fournir des exemples d'utilisation
4. Tester avec 2-3 projets pilotes

### Version PATCH (Bug fixes)

**Quand incrémenter :** Corrections de bugs rétro-compatibles

**Exemples :**
- Correction de bugs
- Patches de sécurité
- Optimisations mineures
- Corrections de documentation
- Mise à jour de dépendances (sécurité)

**Impact utilisateurs :** 🟢 **FAIBLE** - Transparent

**Processus :**
1. Déploiement sans annonce préalable
2. Note dans CHANGELOG.md
3. Message sur Slack #quality-platform

## Processus de release

### 1. Préparation

```bash
# 1. Créer une branche de release
git checkout -b release/v1.2.0

# 2. Mettre à jour la version dans les fichiers
# - Makefile (VERSION)
# - Dockerfile (LABEL version)
# - package.json (version)
# - CHANGELOG.md (ajouter nouvelle section)

# 3. Tester localement
make test

# 4. Scanner pour vulnérabilités
make scan
```

### 2. Tests de validation

**Tests obligatoires avant release :**

- ✅ Build sur Mac Intel
- ✅ Build sur Mac M1/M2
- ✅ Build sur Linux
- ✅ Tests d'exemple passent
- ✅ Scan de sécurité propre
- ✅ Test avec 2 projets réels

```bash
# Test multi-plateforme
make build-multi

# Test avec exemple
make example

# Test avec projet réel
docker run --rm \
  -v /path/to/real/project/tests:/tests/tests \
  webdriverio-service:1.2.0
```

### 3. Release

```bash
# 1. Construire et pousser
make release VERSION=1.2.0 REGISTRY=your-registry.com

# 2. Créer un tag Git
git tag -a v1.2.0 -m "Release 1.2.0 - Description courte"
git push origin v1.2.0

# 3. Créer une GitHub Release avec notes
# - Copier la section du CHANGELOG
# - Ajouter des exemples si nouvelles fonctionnalités
# - Mentionner les breaking changes si applicable
```

### 4. Communication

**Pour PATCH :**
```markdown
📢 WebdriverIO Service v1.2.3 disponible
Correction de bugs et mises à jour de sécurité.
Changelog: [lien]
```

**Pour MINOR :**
```markdown
🚀 WebdriverIO Service v1.3.0 disponible
Nouvelles fonctionnalités :
- Support Firefox
- Nouveau reporter HTML amélioré
- Variable MAX_RETRIES

Mise à jour recommandée.
Documentation: [lien]
Changelog: [lien]
```

**Pour MAJOR :**
```markdown
⚠️ WebdriverIO Service v2.0.0 - Breaking Changes
Cette version majeure contient des changements incompatibles.

🔴 Action requise avant le [date]
📖 Guide de migration: [lien]
🆘 Support: #quality-platform ou sessions d'aide [dates]

Nouvelle version maintenue jusqu'au [date + 6 mois]
Ancienne version (v1.x) supportée jusqu'au [date]
```

### 5. Post-release

- [ ] Mettre à jour la documentation interne
- [ ] Notifier les équipes (Slack + Email si MAJOR/MINOR)
- [ ] Mettre à jour les exemples dans les templates Backstage
- [ ] Monitorer les issues/questions pendant 1 semaine

## Gestion des dépendances

### Dépendances critiques

**Politique de mise à jour :**

| Dépendance | Version actuelle | Stratégie |
|------------|------------------|-----------|
| Node.js | 18.x | Suivre LTS, changer MAJOR seulement |
| WebdriverIO | 8.40.x | Suivre stable, MINOR pour features |
| Chromium | Latest | PATCH chaque mois |
| Reporters | Latest stable | MINOR pour updates |

### Mises à jour de sécurité

**Priorité CRITIQUE :**
- Release PATCH dans les 24h
- Communication immédiate

```bash
# Process de hotfix sécurité
git checkout -b hotfix/security-patch
# ... fix ...
make release VERSION=1.2.4
# Communication urgente
```

### Calendrier de maintenance

**Mensuellement (1er mardi) :**
- Revue des dépendances
- Mises à jour de sécurité
- Release PATCH si nécessaire

**Trimestriellement :**
- Revue des features demandées
- Planning des MINOR releases
- Nettoyage des versions obsolètes

**Annuellement :**
- Évaluation des MAJOR releases
- Revue de la stratégie
- Audit de sécurité complet

## Communication avec les équipes

### Canaux

1. **Slack #quality-platform** : Annonces quotidiennes
2. **Email dev-all@company.com** : MAJOR releases uniquement
3. **Documentation Confluence** : Guides et tutoriels
4. **Office Hours** : Mardi 10h-11h pour support

### Templates de communication

Voir [COMMUNICATION_TEMPLATES.md](./docs/COMMUNICATION_TEMPLATES.md) (à créer)

### FAQ

**Q: Puis-je rester sur une ancienne version ?**
R: Les versions MAJOR sont supportées 6 mois après la nouvelle. Les versions MINOR/PATCH doivent être mises à jour dans les 3 mois.

**Q: Comment tester une nouvelle version avant adoption ?**
R: Utilisez `webdriverio-service:1.3.0-rc1` (release candidates) ou épinglez la version dans un environnement de staging.

**Q: Que se passe-t-il si je ne mets pas à jour ?**
R: Pas de support après la fin de vie. Risques de sécurité et incompatibilités.

## Rétro-compatibilité

### Garanties

**PATCH et MINOR :**
- ✅ Pas de breaking changes
- ✅ Variables d'environnement existantes fonctionnent
- ✅ Volumes Docker inchangés
- ✅ Configuration compatible

**MAJOR :**
- ⚠️ Breaking changes possibles
- 📖 Guide de migration fourni
- 🕐 Période de transition de 6 mois
- 🆘 Support dédié

### Deprecation policy

**Marquer comme obsolète :**
```
# CHANGELOG.md
### Deprecated
- `OLD_ENV_VAR` is deprecated, use `NEW_ENV_VAR` instead. Will be removed in v2.0.0
```

**Timeline de deprecation :**
1. **v1.5.0** : Feature marquée "deprecated", warning dans les logs
2. **v1.6.0 - v1.9.0** : Période de transition (6 mois minimum)
3. **v2.0.0** : Suppression effective

## Checklist Release

### Avant toute release

- [ ] Tous les tests passent
- [ ] Scan de sécurité propre
- [ ] CHANGELOG.md mis à jour
- [ ] Version correcte dans tous les fichiers
- [ ] Documentation à jour
- [ ] Testé sur les 3 plateformes (Mac/Linux/Windows)
- [ ] Testé avec au moins 1 projet réel

### Release PATCH

- [ ] Bug fix documenté
- [ ] Test de non-régression ajouté
- [ ] Message Slack préparé

### Release MINOR

- [ ] Nouvelles features documentées
- [ ] Exemples fournis
- [ ] Projets pilotes testés
- [ ] Annonce 1 semaine avant

### Release MAJOR

- [ ] Guide de migration écrit
- [ ] Breaking changes listés
- [ ] Sessions d'accompagnement planifiées
- [ ] Ancienne version maintenue 6 mois
- [ ] Annonce 3 semaines avant
- [ ] Email envoyé à toutes les équipes

## Support et Maintenance

### Versions supportées

| Version | Release | Fin de support | Status |
|---------|---------|----------------|--------|
| 2.x | TBD | TBD | Planned |
| 1.x | 2026-01-09 | 2027-01-09 | ✅ Supported |

### Politique de support

- **Version courante** : Support complet + nouvelles fonctionnalités
- **Version précédente (N-1)** : Patches de sécurité + bug critiques
- **Versions obsolètes** : Aucun support

## Métriques de succès

**À suivre :**
- Temps moyen d'adoption d'une nouvelle version
- Nombre d'issues/questions par version
- Taux de satisfaction des équipes
- Couverture d'utilisation (combien de projets utilisent le service)

**Objectifs :**
- 80% des projets sur version N ou N-1
- < 5 issues critiques par release
- Temps d'adoption < 2 semaines pour MINOR
- Satisfaction > 8/10
