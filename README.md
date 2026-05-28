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
  setup.sh                ← génère la config opencode depuis .env au démarrage

.agent/
  conventions.md          ← 19 règles CMA CGM (chargées dans toutes les sessions IA)
  create.md               ← guide interactif de création de template (mode ai-create)
  review.md               ← guide interactif d'audit de template (mode ai-review)

scripts/
  lint.sh                 ← linter 19 règles
  ai-create.sh            ← assistant IA en mode création
  ai-review.sh            ← assistant IA en mode revue

example-template/
  template.yaml           ← un vrai template Backstage, commenté ligne par ligne
  skeleton/
    catalog-info.yaml     ← fichier généré par le template (avec variables Nunjucks)
    README.md             ← README généré dans le repo cible
```

### Ce qui est installé automatiquement dans le container

| Outil | Rôle |
|---|---|
| Node.js 20 LTS | Runtime de base |
| `@backstage/cli` | CLI officiel Backstage |
| Yarn | Gestionnaire de paquets utilisé par Backstage |
| **opencode** (CLI) | Assistant IA dans le terminal — configuré automatiquement depuis `.env` |
| **sst-dev.opencode** (extension VS Code) | Interface graphique opencode intégrée dans VS Code |
| **redhat.vscode-yaml** (extension VS Code) | Validation YAML avec schémas (erreurs en rouge inline) |
| **ronnidc.nunjucks** (extension VS Code) | Syntax highlighting pour les templates Nunjucks |

---

## Prérequis (à installer sur ta machine)

1. **Docker Desktop** — [télécharger ici](https://www.docker.com/products/docker-desktop/)
2. **VS Code** — [télécharger ici](https://code.visualstudio.com/)
3. **Extension "Dev Containers"** dans VS Code
   - Ouvre VS Code → Extensions (`Cmd+Shift+X`) → cherche "Dev Containers" → installer

---

## Configuration de l'assistant IA

L'assistant IA (opencode) se connecte à ton modèle local ou distant via un fichier `.env`.

```bash
# À la racine du projet
cp .env.example .env
```

Puis édite `.env` avec tes valeurs :

```bash
AI_API_BASE=http://ton-serveur:port/v1   # URL de l'API OpenAI-compatible
AI_API_KEY=ta-cle-api                    # Clé API (ou "dummy" si pas d'auth)
AI_MODEL=llama3.2                        # Nom du modèle sur ton serveur
GH_TOKEN=ghp_xxxx                        # Token GitHub (optionnel, pour push de templates)
```

Le fichier `.env` est dans `.gitignore` — il ne sera jamais commité.

> **Serveur sur le réseau local (LAN) ?** Les containers Docker sur Mac ne peuvent pas atteindre
> directement les IPs du réseau local. Lance `./start-proxy.sh` sur ta machine hôte (nécessite socat),
> puis utilise `http://host.docker.internal:8000/v1` dans `AI_API_BASE`.

Au démarrage du container, `setup.sh` lit `.env` et génère automatiquement
`~/.config/opencode/opencode.json`. opencode est prêt sans aucune configuration manuelle.

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
backstage-cli --version     # doit afficher la version du CLI
opencode --version          # doit afficher la version opencode
./scripts/lint.sh example-template/    # doit afficher le rapport de lint
```

---

## Utiliser l'assistant IA (opencode)

opencode est un assistant IA en ligne de commande. Il est configuré **automatiquement** au démarrage
du container depuis ton `.env` — aucune manipulation manuelle.

### Via VS Code (recommandé)

opencode s'intègre directement dans VS Code via l'extension `sst-dev.opencode`. Ouvre-la depuis la
barre latérale gauche pour une interface de chat complète avec accès aux fichiers du projet.

Les **conventions CMA CGM** (19 règles) sont automatiquement chargées dans chaque session.

### Via le terminal

```bash
opencode     # ouvre une session interactive
```

### Modes spécialisés

```bash
./scripts/ai-create.sh                      # création d'un template from scratch
./scripts/ai-review.sh example-template/    # audit et correction d'un template existant
```

**Mode création** — l'assistant te guide via un dialogue interactif :
- Il pose des questions sur ton besoin (type de service, équipe, paramètres spécifiques)
- Il valide chaque choix avant de générer les fichiers
- Il vérifie les 19 règles et te propose des corrections si nécessaire

**Mode revue** — l'assistant audite un template existant :
- Il lit les fichiers du template
- Il vérifie les 19 règles une par une, en expliquant pourquoi chaque règle existe
- Il propose des corrections minimales avec diffs YAML lisibles
- Il demande confirmation avant d'appliquer chaque modification

---

## Tooling — Linter (19 règles CMA CGM)

```bash
./scripts/lint.sh example-template/     # lint un template spécifique
./scripts/lint.sh                        # lint tous les templates dans templates/
```

Le linter vérifie les 19 règles (R01–R19) : nommage, paramètres, structure skeleton, step IDs,
outputs. Il retourne un code d'erreur non-zéro si des règles échouent — intégrable en CI.

La référence complète des règles est dans [.agent/conventions.md](.agent/conventions.md).

---

## Comprendre le template exemple

Le fichier [example-template/template.yaml](example-template/template.yaml) est un template
Backstage complet et commenté. Il montre :

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
