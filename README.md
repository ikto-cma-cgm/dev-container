# Dev Container — Backstage Template Creator

## C'est quoi un dev container ?

Imagine que ton environnement de développement (Node.js, les extensions VS Code, les outils CLI,
les variables d'environnement) soit décrit dans un fichier texte, comme un `Dockerfile`.
C'est exactement ce qu'est un dev container.

Quand tu ouvres ce projet dans VS Code, il détecte le dossier `.devcontainer/` et te propose
d'ouvrir le projet **à l'intérieur d'un container Docker** pré-configuré. Tu travailles dans
VS Code normalement, mais ton code tourne dans un environnement isolé et reproductible.

**Résultat :** peu importe qui ouvre ce repo (toi demain, un nouveau collègue, un CI), il obtient
exactement le même environnement — les mêmes outils, les mêmes versions, les mêmes extensions.

---

## Ce que contient ce dev container

```
.devcontainer/
  devcontainer.json       ← la "recette" de l'environnement

.github/instructions/
  conventions.instructions.md         ← conventions CMA CGM (R01–R19 + C01–C05 + ADR-R1/ADR-R3)
  template-standards.instructions.md  ← standards unitaires/composites

scripts/
  lint.sh                 ← linter templates (unitaires, composable, ADR)
```

### Ce qui est installé automatiquement dans le container

| Outil | Rôle |
|---|---|
| Node.js 20 LTS | Runtime de base |
| `@backstage/cli` | CLI officiel Backstage |
| Yarn | Gestionnaire de paquets utilisé par Backstage |
| **redhat.vscode-yaml** (extension VS Code) | Validation YAML avec schémas (erreurs en rouge inline) |
| **stoplight.spectral** (extension VS Code) | Linter OpenAPI/Spectral en temps réel |
| **ronnidc.nunjucks** (extension VS Code) | Syntax highlighting pour les templates Nunjucks |

---

## Prérequis (à installer sur ta machine)

1. **Docker Desktop** — [télécharger ici](https://www.docker.com/products/docker-desktop/)
2. **VS Code** — [télécharger ici](https://code.visualstudio.com/)
3. **Extension "Dev Containers"** dans VS Code
   - Ouvre VS Code → Extensions (`Cmd+Shift+X`) → cherche "Dev Containers" → installer

---

## Configuration

```bash
# À la racine du projet
cp .env.example .env
```

Puis édite `.env` :

```bash
GH_TOKEN=ghp_xxxx    # Token GitHub pour les opérations gh (création de repos, push, etc.)
```

Le fichier `.env` est dans `.gitignore` — il ne sera jamais commité.

---

## Démarrage

1. Ouvre ce dossier dans VS Code : `code /chemin/vers/ce/dossier`
2. VS Code détecte le `.devcontainer/` et affiche une notification :
   **"Reopen in Container"** → clique dessus
3. Le container se build (2-3 minutes la première fois, immédiat ensuite)
4. Quand c'est prêt, tu travailles normalement dans VS Code

**Vérifier que tout fonctionne :**

```bash
# Dans le terminal intégré VS Code (Ctrl+`)
backstage-cli --version                        # doit afficher la version du CLI
./scripts/lint.sh output/templates/node-template   # doit afficher le rapport de lint
```

---

## Tooling — Linter (standards CMA CGM)

```bash
./scripts/lint.sh output/templates/node-template   # lint un template spécifique
./scripts/lint.sh output/templates                # lint tous les templates dans output/templates
./scripts/lint.sh --only Composable <template>    # lint C01–C05 + ADR sur un orchestrateur
./scripts/lint.sh                                 # lint tous les templates dans templates/
```

Le linter vérifie les règles unitaires (R01–R19), composable (C01–C05) et ADR (ADR-R1, ADR-R3).
Il retourne un code d'erreur non-zéro si des règles échouent — intégrable en CI.

La référence complète des règles est dans
[.github/instructions/conventions.instructions.md](.github/instructions/conventions.instructions.md).

---

## Comprendre le template exemple

Les templates dans `output/templates/` sont des exemples complets de templates Backstage. Ils montrent :

1. **`metadata`** — nom, description, tags (ce qui apparaît dans la galerie de templates)
2. **`parameters`** — les champs du formulaire (générés automatiquement par Backstage)
3. **`steps`** — les actions exécutées en coulisses :
   - `fetch:template` → copie les fichiers du dossier `skeleton/` en substituant les variables
   - `publish:github` → crée le repo GitHub et pousse le code
   - `catalog:register` → enregistre le service dans le Backstage catalog
4. **`output`** — les liens affichés à l'utilisateur après création

Les fichiers dans `skeleton/` utilisent la syntaxe `${{ values.nomDuParametre }}` pour les variables.

---

## Ressources Backstage

- [Backstage Software Templates — documentation officielle](https://backstage.io/docs/features/software-templates)
- [Liste des scaffolder actions intégrées](https://backstage.io/docs/features/software-templates/builtin-actions)
- [Créer une scaffolder action custom](https://backstage.io/docs/features/software-templates/writing-custom-actions)
- [Syntaxe Nunjucks](https://mozilla.github.io/nunjucks/templating.html)
