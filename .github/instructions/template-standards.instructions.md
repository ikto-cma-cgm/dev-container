---
applyTo: "**"
---
# Synthetic Templates Agent — Standards

Standards généralisés pour créer, reviewer et maintenir des Software Templates Backstage CMA CGM, issus de l'analyse comparative des templates unitaires et composites.

Ce document couvre les patterns de structure et d'assemblage. Pour les règles d'audit Composable (C01–C05, ADR-R1, ADR-R3), se référer aussi à `mounted/documentation/docs/providing/composable-service-standards.md` et `.../linter-rules.md`.

---

## 1. Standards communs (tous templates)

### template.yaml — En-tête

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: <kebab-case>-template       # R01
  title: <sans emoji>               # R02
  description: <≤ 200 chars>        # R03
  annotations:
    simpleicons.org/icon-slug: <slug>
    backstage.io/techdocs-ref: dir:.
  tags:
    - application                    # R06 — tag catégorie obligatoire
spec:
  type: <validType>                  # R05 — see scripts/lint-rules.yaml validTypes (service|library|website|pipeline|testing-tool|code-analysis|action)
  owner: group:<owner-group>         # R04
```

`spec.type` reflects what the template *produces* :

- `service` — Spring Boot / Node service running at runtime
- `library` — versioned reusable asset (Liquibase migrations, shared lib, npm package)
- `website` — static site / SPA
- `pipeline`, `testing-tool`, `code-analysis`, `action` — automation tooling

Extend `scripts/lint-rules.yaml` `validTypes` if a new category is needed.

### Paramètres obligatoires (tous templates)

Les groupes de paramètres doivent suivre cet ordre :

1. **Service identity** — `name`, `description`, `owner` (required)
2. **Catalog placement** — `system` (required), `domain` (required)
3. **<Domaine> configuration** — paramètres spécifiques au type de service
4. **Repository destination** — `repoProvider`, `repoOwner` (required)

Chaque champ doit avoir `ui:help`. L'owner utilise `ui:field: EntityPicker` avec `catalogFilter: [{kind: Group}]`.

### Steps — Pattern dual-provider

```
fetch-skeleton
├── publish-github      (if repoProvider == 'github')
├── register-catalog-github  (if repoProvider == 'github')
├── publish-gitlab      (if repoProvider == 'gitlab')
└── register-catalog-gitlab  (if repoProvider == 'gitlab')
```

Les step IDs utilisent `verb-object` kebab-case (R17). Les conditions `if` s'appuient sur `${{ parameters.repoProvider }}`.

### Output — Links & Text

Les `output.links` et `output.text` utilisent l'opérateur `||` pour couvrir les deux providers :

```yaml
output:
  links:
    - title: Repository
      url: ${{ steps['publish-github'].output.remoteUrl || steps['publish-gitlab'].output.remoteUrl }}
    - title: Open in Catalog
      icon: catalog
      url: ${{ steps['register-catalog-github'].output.entityRef || steps['register-catalog-gitlab'].output.entityRef }}
  text:
    - title: Next Steps
      content: |
        <instructions spécifiques au type de service>
```

---

## 2. Templates unitaires

Template qui génère un seul dépôt avec une seule entité `Component`.

### Structure de fichiers

```
<unit-template>/
├── template.yaml
├── docs/
│   └── index.md
├── mkdocs.yml
└── skeleton/
    ├── catalog-info.yaml             # 1× Component
    ├── README.md
    ├── mkdocs.yml
    ├── docs/
    │   └── index.md
    └── <fichiers spécifiques au type>
```

### catalog-info.yaml

Un seul bloc `Component`. Annotations `sonarqube.org/project-key` uniquement si le service produit du code analysable.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: ${{ values.name }}
  description: ${{ values.description }}
  tags:
    - <langage>
    - <catégorie>
  links:
    - url: https://${{ values.repoProvider }}.com/${{ values.repoOwner }}/${{ values.name }}
      title: Repository
      icon: ${{ values.repoProvider }}
  annotations:
    backstage.io/techdocs-ref: dir:.
    jenkins.io/job-full-name: cma-cgm/${{ values.name }}/main
spec:
  type: <validType>                 # R05 — service | library | website | ...
  lifecycle: experimental
  owner: ${{ values.owner }}
  system: ${{ values.system }}
  domain: ${{ values.domain }}
```

> `system` + `domain` are required for CMA CGM Catalog placement and must be propagated into the generated `catalog-info.yaml`.

### Règles unitaires

- **Un seul** `fetch:template` step avec `url: ./skeleton`
- **Un seul** `catalog-info.yaml` dans le root du skeleton
- Annotations optionnelles (`simpleicons.org/icon-slug`) peuvent enrichir l'affichage Catalog

---

## 3. Templates composites

Template qui assemble plusieurs composants en un seul dépôt et produit plusieurs entités Catalog (`Component` + `Resource`).

### Structure de fichiers

```
<composite-template>/
├── template.yaml
├── docs/
│   └── index.md
├── mkdocs.yml
├── skeleton-app/                 # Main skeleton → repo root
│   ├── catalog-info.yaml         # Component (+ optional Resource as multi-doc YAML)
│   ├── README.md
│   ├── mkdocs.yml
│   ├── docs/
│   │   └── index.md
│   └── <service files>
└── skeleton-<role>/              # Optional secondary skeleton(s) — see "Composition modes" below
    ├── catalog-info.yaml         # Required by linter R12 (may be a Location stub)
    ├── README.md                 # Required by linter R15
    └── <secondary assets>
```

> The linter recognises `skeleton/` and `skeleton-*/` (glob) as skeleton directories. Each one must contain `catalog-info.yaml` + `README.md` (rules R12, R15).

### Composition modes

Three modes are supported. Choose based on reuse strategy and lifecycle needs.

**Mode (a) — Embedded** : secondary assets pre-merged inside `skeleton-app/`. Single local fetch. No `skeleton-<role>/`.

- Pros: simple, single fetch step
- Cons: not reusable; all changes go through `skeleton-app/`

**Mode (b) — Separate local skeletons** : each `skeleton-<role>/` fetched with its own `fetch:template` step and a `targetPath`.

```yaml
steps:
  - id: fetch-app-skeleton
    action: fetch:template
    input:
      url: ./skeleton-app
      values: {...}
  - id: fetch-<role>-skeleton
    action: fetch:template
    input:
      url: ./skeleton-<role>
      targetPath: ./<dedicated/path>
      values: {...}
```

- Pros: secondary asset has its own lifecycle; modular
- Cons: no cross-template code reuse; still duplicates base boilerplate

**Mode (c) — Remote base fetch + local overlay ✅ Standard CMA CGM** : the base skeleton is fetched from a versioned remote repo (`ikto-cma-cgm/backstage-templates`), and a local `skeleton-overlay/` provides only the delta files specific to the composition.

```yaml
steps:
  - id: fetch-<base>-skeleton
    action: fetch:template
    input:
      url: https://github.com/ikto-cma-cgm/backstage-templates/tree/main/<base-template>/skeleton?ref=v0.1.0
      values: {...base values...}

  - id: fetch-<role>-overlay          # optional: secondary component base (e.g. liquibase)
    action: fetch:template
    input:
      url: https://github.com/ikto-cma-cgm/backstage-templates/tree/main/<role-template>/skeleton?ref=v0.1.0
      targetPath: ./<dedicated/path>
      values: {...role values...}

  - id: fetch-app-overlay
    action: fetch:template
    input:
      url: ./skeleton-overlay
      targetPath: .
      values: {...full values including composition-specific ones...}

  - id: fetch-<role>-overlay          # optional: delta for secondary component
    action: fetch:template
    input:
      url: ./skeleton-<role>-overlay
      targetPath: ./<dedicated/path>
      values: {...}
```

- Pros: inherits base updates automatically on re-tag; `skeleton-overlay/` is minimal (only delta files); C01 PASS with pinned `?ref=v0.1.0`
- Cons: requires the base template to be published in `backstage-templates` repo first

**`skeleton-overlay/`** contains only the files that differ from the base skeleton:
- `catalog-info.yaml` (multi-doc: Component + optional Resource + System)
- `pom.xml` / `package.json` (composition-specific deps and plugins)
- `README.md`, `mkdocs.yml`, `docs/` (composition-specific documentation)
- Any source files specific to the composition (e.g. `src/api/openapi.yaml`, generated types handler)
- **Excludes** files identical to the base (e.g. `application.yml`, `.gitignore`)

**`skeleton-<role>-overlay/`** (for secondary components) typically contains only:
- `catalog-info.yaml` (stub `kind: Location` or proper entity)
- `README.md`

Catalog registration is driven by a **single root** `catalog-info.yaml` (multi-doc when more than one entity). The `catalog-info.yaml` inside secondary overlays is a linter-compliance stub (`kind: Location` with empty `targets`).

### catalog-info.yaml — Multi-doc

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: ${{ values.name }}
  # tags, links, annotations standards
spec:
  type: <validType>                 # R05 — service | library | website | ...
  lifecycle: experimental
  owner: ${{ values.owner }}
  system: ${{ values.system }}
  domain: ${{ values.domain }}
  dependsOn:
    - resource: ${{ values.name }}-<resource-suffix>
---
apiVersion: backstage.io/v1alpha1
kind: Resource
metadata:
  name: ${{ values.name }}-<resource-suffix>
  description: ${{ values.description }} - <resource description>
  annotations:
    simpleicons.org/icon-slug: <resource-icon>
spec:
  type: <resource-type>             # free-form resource type, e.g. "liquibase", "database"
  lifecycle: experimental
  owner: ${{ values.owner }}
  system: ${{ values.system }}
  domain: ${{ values.domain }}
```

> For composites, keep `system` and `domain` consistent across generated entities unless there is a justified ownership split.

### Règles composites

- **Naming Resource** : `<name>-<suffixe>` — suffixe explicite pour distinguer la ressource
- **dependsOn** : le Component déclare sa dépendance vers chaque Resource
- **Resource kind** : `spec.type` reflète la nature de la ressource
- **Annotations icon** : `simpleicons.org/icon-slug` pour une icône distincte dans le graph Catalog
- **Paramètres unifiés** : les paramètres de tous les composants sont fusionnés dans des groupes cohérents
- **Un seul publish/register** : un seul repo est publié malgré la composition

---

## 4. Différentiels : Unit vs Composite

| Aspect | Unit | Composite |
|---|---|---|
| Skeleton dirs | 1 (`skeleton/`) | 1+ remote base(s) + `skeleton-overlay/` + optional `skeleton-<role>-overlay/` |
| fetch:template | 1 step | 2–4 steps: remote base(s) then local overlay(s) (Mode c — standard) |
| catalog-info.yaml | 1 Component | Component (+ Resource(s) multi-doc `---`) in overlay; stubs in secondary overlays |
| dependsOn | Absent | Present when Resource(s) are declared (Component → Resource) |
| Pipeline | Single | Single (main service pipeline) |
| Parameters | Type-specific | Unified across components |

---

## 5. Conditions Nunjucks dans skeleton

Les fichiers skeleton utilisent **Nunjucks** (`{% %}`) pour le conditionnement au moment du scaffold. Interpolations simples avec `${{ values.* }}`, branches conditionnelles avec Nunjucks.

```yaml
{# Exemple générique de condition #}
{% if values.type == 'option-a' -%}
key: value-a
{%- endif %}
{% if values.type == 'option-b' -%}
key: value-b
{%- endif %}
```

**Convention** : utiliser `-` dans les marqueurs (`{% -` / `-%}`) pour supprimer les sauts de ligne inutiles.

---

## 6. Checklist de création

### Pour un template unitaire
- [ ] Nom en `kebab-case-template` (R01), pas d'emoji dans le titre (R02), description ≤ 200 chars (R03)
- [ ] `skeleton/` avec `catalog-info.yaml`, `README.md`, `mkdocs.yml`, `docs/index.md`
- [ ] Paramètres : identity + catalog + domaine + repo destination
- [ ] Steps : fetch → publish (2 providers conditionnels) → register (2 providers conditionnels)
- [ ] Output : links + text avec `||` pour dual provider
- [ ] `docs/index.md` + `mkdocs.yml` du template lui-même
- [ ] Les règles du linter applicables (R01–R19 + C01–C05 + ADR-R1/ADR-R3 selon le type de template)

### Pour un template composite
- [ ] Tout ce qui précède, PLUS :
- [ ] Mode de composition : **(c) Remote fetch + overlay** (standard CMA CGM — voir §3)
- [ ] Step `fetch-<base>-skeleton` → URL remote pinned `?ref=v0.1.0` sur `ikto-cma-cgm/backstage-templates`
- [ ] `skeleton-overlay/` contient uniquement les fichiers delta (catalog-info, pom.xml/package.json, docs, src spécifiques)
- [ ] Pour chaque composant secondaire : step remote fetch `?ref=v0.1.0` + `skeleton-<role>-overlay/` avec stub catalog-info et README
- [ ] `catalog-info.yaml` racine multi-doc avec `---` si plusieurs entités (Component + Resource(s))
- [ ] `dependsOn` sur le Component vers chaque Resource déclarée
- [ ] Paramètres unifiés couvrant tous les composants
- [ ] C01 doit PASSER (pas SKIP) grâce aux refs pinned `?ref=v0.1.0`
- [ ] `README.md` mentionne tous les composants intégrés et leur stratégie de composition
