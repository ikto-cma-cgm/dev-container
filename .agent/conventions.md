# CMA CGM Backstage Template — Conventions & Standards

Référence complète pour créer et valider des Software Templates (Golden Paths) sur le Developer Portal CMA CGM. Toute modification doit passer les 19 règles du linter **et** respecter les standards de compliance du Catalog.

---

## Terminologie CMA CGM

| Terme | Définition |
|---|---|
| **Golden Path** | Software Template qui encode les standards CMA CGM pour un type de service donné |
| **Platform Provider** | Ingénieur qui crée et maintient des Golden Paths |
| **Platform Consumer** | Développeur qui exécute un Golden Path pour créer un service |
| **Scaffolder** | Le moteur Backstage qui exécute les steps d'un template |
| **Skeleton** | Les fichiers boilerplate dans `skeleton/` — ce qui est copié dans le repo cible |
| **EUP** | Enterprise User Portal — le système de tickets pour les opérations contrôlées |
| **Domain → System → Component** | La hiérarchie du Catalog CMA CGM |

---

## Structure de fichiers obligatoire

```
<template-name>/
├── template.yaml                   ← obligatoire
├── docs/                           ← TechDocs du template lui-même
│   └── index.md
└── skeleton/
    ├── catalog-info.yaml           ← obligatoire (R12)
    ├── README.md                   ← obligatoire (R15)
    ├── mkdocs.yml                  ← obligatoire pour TechDocs du service généré
    └── docs/
        └── index.md
```

---

## 19 Règles du linter (R01–R19)

### Identité (R01–R07)

| Règle | Champ | Exigence | Valide | Invalide |
|---|---|---|---|---|
| R01 | `metadata.name` | kebab-case, se termine par `-template` | `nodejs-service-template` | `nodejs-service`, `NodeService` |
| R02 | `metadata.title` | pas d'emoji | `Node.js Service` | `🚀 Node.js Service` |
| R03 | `metadata.description` | ≤ 200 caractères | `Scaffolds a Node.js microservice…` | *(>200 chars)* |
| R04 | `spec.owner` | doit être renseigné | `group:platform-team` | *(vide)* |
| R05 | `spec.type` | enum valide | `service` | `app`, `backend` |
| R06 | `metadata.tags` | au moins un tag catégorie | `[application, nodejs]` | `[nodejs, microservice]` |
| R07 | `metadata.tags` | pas de tags interdits | — | `[application, demo]` |

Tags catégorie autorisés : `application`, `integration`, `quality`, `action`
Tags interdits : `one-click`, `golden-path`, `demo`, `advanced`, `simple`

### Paramètres (R08–R11)

| Règle | Exigence |
|---|---|
| R08 | Paramètre `name` avec `pattern` regex (ex: `^[a-z][a-z0-9-]*[a-z0-9]$`) |
| R09 | Paramètre `description` obligatoire |
| R10 | Paramètre `owner` avec `ui:field: EntityPicker` (pas `OwnerPicker`) |
| R11 | Chaque champ de paramètre doit avoir `ui:help` |

> R08–R10 sont ignorés pour `spec.type: action`.

### Skeleton (R12–R16)

| Règle | Exigence |
|---|---|
| R12 | `skeleton/catalog-info.yaml` doit exister |
| R13 | `skeleton/catalog-info.yaml` doit contenir `backstage.io/techdocs-ref: dir:.` |
| R14 | `skeleton/catalog-info.yaml` doit avoir `lifecycle: experimental` (jamais `production`) |
| R15 | `skeleton/README.md` doit exister |
| R16 | Pas d'expression `${{ }}` non reconnue dans les fichiers skeleton |

Préfixes `${{ }}` autorisés : `values.`, `parameters.`, `steps[`, `steps.`, `secrets.`, `env.`, `github.`, `matrix.`

### Steps (R17–R19)

| Règle | Exigence |
|---|---|
| R17 | Tous les step `id` suivent le format `verb-object` kebab-case |
| R18 | `spec.output.links` contient au moins un lien |
| R19 | `spec.output.text` contient au moins un bloc texte |

---

## Standards de compliance CMA CGM (au-delà des 19 règles)

Ces standards s'appliquent au `skeleton/catalog-info.yaml` — c'est-à-dire au service qui sera généré par le template.

### Hiérarchie Catalog obligatoire

Chaque service doit appartenir à un System et un Domain. Sans ces deux champs, il est invisible dans les vues filtrées.

```yaml
spec:
  system: ${{ values.system }}   # ← paramètre obligatoire
  domain: ${{ values.domain }}   # ← paramètre obligatoire
```

Les templates doivent donc inclure `system` et `domain` dans leurs paramètres.

### Annotations requises

| Annotation | Usage |
|---|---|
| `backstage.io/techdocs-ref: dir:.` | Active l'onglet Docs dans le portail — **obligatoire** |
| `jenkins.io/job-full-name: cma-cgm/${{ values.name }}/main` | Lie le pipeline CI à la page Catalog |
| `sonarqube.org/project-key: cma-cgm:${{ values.name }}` | Lie les métriques qualité à la page Catalog |

### `catalog-info.yaml` complet et valide

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: ${{ values.name }}
  description: ${{ values.description }}
  tags:
    - <langage>            # ex: java, nodejs, python
    - <catégorie>          # ex: backend, frontend, batch
  links:
    - url: https://github.com/cma-cgm/${{ values.name }}
      title: Repository
      icon: github
    - url: https://wiki.cma-cgm.com/${{ values.name }}/runbook
      title: On-call runbook
      icon: docs
  annotations:
    backstage.io/techdocs-ref: dir:.
    jenkins.io/job-full-name: cma-cgm/${{ values.name }}/main
    sonarqube.org/project-key: cma-cgm:${{ values.name }}
spec:
  type: service                        # ou website, pipeline, etc.
  lifecycle: experimental              # R14 — toujours experimental dans le skeleton
  owner: ${{ values.owner }}
  system: ${{ values.system }}         # obligatoire
  domain: ${{ values.domain }}         # obligatoire
```

---

## Paramètres standards d'un template

Les paramètres minimum attendus dans tout template `service`, `website` ou `pipeline` :

```yaml
parameters:
  - title: Service identity
    required: [name, description, owner]
    properties:
      name:
        title: Service name
        type: string
        pattern: '^[a-z][a-z0-9-]*[a-z0-9]$'     # R08
        ui:help: 'Kebab-case, unique dans le Catalog. Ex: quote-pricing-api'
      description:
        title: Description
        type: string
        ui:help: 'Une phrase décrivant le service. Apparaîtra dans le Catalog.'
      owner:
        title: Owner
        type: string
        ui:field: EntityPicker                      # R10 — jamais OwnerPicker
        ui:options:
          catalogFilter:
            - kind: Group
        ui:help: 'Équipe responsable. Sera paginée en cas d'incident.'

  - title: Catalog placement
    required: [system, domain]
    properties:
      system:
        title: System
        type: string
        ui:help: 'System Backstage auquel ce service appartient. Ex: pricing'
      domain:
        title: Domain
        type: string
        ui:help: 'Domain métier. Ex: finance, shipping, platform'
```

---

## Steps standards

Séquence standard : `fetch-skeleton` → `publish-repo` → `register-catalog`

```yaml
steps:
  - id: fetch-skeleton             # R17 : verb-object
    name: Fetch skeleton
    action: fetch:template
    input:
      url: ./skeleton
      values:
        name: ${{ parameters.name }}
        description: ${{ parameters.description }}
        owner: ${{ parameters.owner }}
        system: ${{ parameters.system }}
        domain: ${{ parameters.domain }}

  - id: publish-repo               # R17 : verb-object
    name: Publish repository
    action: publish:github
    input:
      allowedHosts: ['github.com']
      repoUrl: github.com?owner=cma-cgm&repo=${{ parameters.name }}
      description: ${{ parameters.description }}

  - id: register-catalog           # R17 : verb-object
    name: Register in catalog
    action: catalog:register
    input:
      repoContentsUrl: ${{ steps['publish-repo'].output.repoContentsUrl }}
      catalogInfoPath: /catalog-info.yaml

output:
  links:                           # R18
    - title: Repository
      url: ${{ steps['publish-repo'].output.remoteUrl }}
    - title: Open in Catalog
      icon: catalog
      url: ${{ steps['register-catalog'].output.entityRef }}
  text:                            # R19
    - title: Next Steps
      content: |
        Service **${{ parameters.name }}** créé.
        1. Clone : `git clone ${{ steps['publish-repo'].output.remoteUrl }}`
        2. Install : `npm install` (ou équivalent)
        3. Configure les secrets dans le repo Settings
        4. Le pipeline CI démarre automatiquement sur le premier push
```

---

## Gouvernance — qui fait quoi

| Action | EUP requis | Qui |
|---|:---:|---|
| Créer les fichiers du template dans le repo | ❌ | Platform Provider — commit direct |
| **Enregistrer** le template dans le Catalog | ✅ | Via ticket EUP → équipe Developer Portal |
| Modifier un template existant (skeleton, params, steps) | ❌ | Platform Provider — commit direct |
| **Supprimer** un template du Catalog | ✅ | Via ticket EUP → équipe Developer Portal |

### Contenu d'un ticket EUP pour registration

- **Template name** : `<metadata.name>`
- **Template repository URL** : URL complète du dossier contenant `template.yaml`
- **Requested action** : Add template / Delete template
- **Justification** : quelles équipes l'utiliseront, quel besoin il couvre
- **Impacted teams** : équipes qui consommeront le template dans le prochain trimestre

### Règles pour les modifications de templates en production

- **Nouveau paramètre** : toujours fournir un défaut qui reproduit le comportement actuel
- **Paramètre renommé/supprimé** : breaking change — notifier toutes les équipes consommatrices
- **Changement skeleton** : n'affecte que les futurs scaffolds — les services déjà créés sont inchangés
- **Tag la version** : `<template-name>-v1.x.0` dans le repo templates

---

## Validate My Template (action Backstage)

En plus du linter local (`./scripts/lint.sh`), tu peux utiliser l'action **Validate My Template** dans le portail :

1. Sidebar → **Actions**
2. Sélectionner **Validate My Template**
3. Coller l'URL complète du dossier template (GitHub/GitLab)
4. ⚠️ Le nom de branche ne doit **pas** contenir de slashes — utiliser `main`, pas `feat/my-feature`
5. Lancer → rapport complet avec numéros de règle et corrections
