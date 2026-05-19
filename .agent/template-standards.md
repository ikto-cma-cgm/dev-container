# Synthetic Templates Agent — Standards

Standards généralisés pour créer, reviewer et maintenir des Software Templates Backstage CMA CGM, issus de l'analyse comparative des templates unitaires et composites.

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
  type: service                      # R05
  owner: group:<owner-group>         # R04
```

### Paramètres obligatoires (tous templates)

Les groupes de paramètres doivent suivre cet ordre :

1. **Service identity** — `name`, `description`, `owner` (required)
2. **Catalog placement** — `system`, `domain` (required)
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
  type: service
  lifecycle: experimental
  owner: ${{ values.owner }}
  system: ${{ values.system }}
  domain: ${{ values.domain }}
```

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
├── skeleton-app/                 # Skeleton principal → root du repo
│   ├── catalog-info.yaml         # Component + Resource (multi-doc YAML)
│   ├── README.md
│   ├── mkdocs.yml
│   ├── docs/
│   │   └── index.md
│   └── <fichiers du service>
└── skeleton- phụ/                # Source de référence, non référencée dans template.yaml
    └── <assets intégrés dans skeleton-app/>
```

### Principe de composition

- `skeleton-app/` est le **conteneur principal** — seul skeleton référencé dans `template.yaml` via `fetch:template`
- Tout skeleton secondaire est **déjà intégré** dans `skeleton-app/` au moment de la création du template
- Le `fetch:template` ne pointe que vers un seul `url: ./skeleton-app`

### catalog-info.yaml — Multi-doc

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: ${{ values.name }}
  # tags, links, annotations standards
spec:
  type: service
  lifecycle: experimental
  owner: ${{ values.owner }}
  system: ${{ values.system }}
  domain: ${{ values.domain }}
  dependsOn:
    - resource: ${{ values.name }}-<suffixe-ressource>
---
apiVersion: backstage.io/v1alpha1
kind: Resource
metadata:
  name: ${{ values.name }}-<suffixe-ressource>
  description: ${{ values.description }} - <description ressource>
  annotations:
    simpleicons.org/icon-slug: <icon-ressource>
spec:
  type: <type-ressource>
  lifecycle: experimental
  owner: ${{ values.owner }}
  system: ${{ values.system }}
  domain: ${{ values.domain }}
```

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
| Skeleton dirs | 1 (`skeleton/`) | 1 conteneur + N sources de référence |
| fetch:template | 1 step | 1 step (vers skeleton conteneur) |
| catalog-info.yaml | 1 Component | Component + Resource(s) (multi-doc `---`) |
| dependsOn | Absent | Présent (Component → Resource) |
| Pipeline | Unique | Unique (celui du service principal) |
| Paramètres | Spécifiques au type | Fusionnés des composants |

---

## 5. Conditions Jinja2 dans skeleton

Les fichiers skeleton utilisent **Jinja2** (`{% %}`) pour le conditionnement au moment du scaffold. Interpolations simples avec `${{ values.* }}`, branches conditionnelles avec Jinja2.

```yaml
{# Exemple générique de condition #}
{% if values.type === 'option-a' -%}
key: value-a
{%- endif %}
{% if values.type === 'option-b' -%}
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
- [ ] Les 19 règles du linter (conventions.md)

### Pour un template composite
- [ ] Tout ce qui précède, PLUS :
- [ ] `skeleton-app/` contient le skeleton fusionné (tous les composants intégrés)
- [ ] Skeletons secondaires sont des sources de référence, non référencés dans `template.yaml`
- [ ] `catalog-info.yaml` multi-doc avec `---`, 1 Component + 1+ Resource
- [ ] `dependsOn` sur le Component vers chaque Resource
- [ ] Paramètres unifiés couvrant tous les composants
- [ ] `README.md` mentionne tous les composants intégrés