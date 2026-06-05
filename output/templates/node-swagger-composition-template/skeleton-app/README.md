# ${{ values.name }}

${{ values.description }}

## Overview

Ce service suit une approche OpenAPI-first. La spécification OpenAPI est récupérée depuis l'entité API `${{ values.apiRef }}` lors du build npm et utilisée pour générer le code serveur TypeScript Express.

## Catalog entities

- `Component`: service runtime Node.js
- API liée : `${{ values.apiRef }}` (entité API externe — source de vérité dans son propre repo)

## Getting started

> **Prérequis** : le repo de la spec OpenAPI (`${{ values.apiEntityName }}`) est privé.
> Exportez votre Personal Access Token avant de builder :
> ```bash
> export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
> ```

```bash
npm install
npm run build   # télécharge la spec et génère le code serveur dans src/openapi-generated/
npm run dev     # démarre en mode développement
```

Si vous êtes derrière un proxy d'entreprise avec inspection TLS, configurez le certificat racine pour Node.js :

```bash
export NODE_EXTRA_CA_CERTS=/path/to/corporate-ca.pem
```

## Health check

```bash
curl http://localhost:${{ values.port }}/health
```
