# ${{ values.name }}

${{ values.description }}

## Overview

Ce service suit une approche OpenAPI-first. La spécification OpenAPI est récupérée depuis l'entité API `${{ values.apiRef }}` lors du build npm et utilisée pour générer le code serveur TypeScript Express.

## Catalog entities

- `Component`: service runtime Node.js
- API liée : `${{ values.apiRef }}` (entité API externe — source de vérité dans son propre repo)

## Getting started

```bash
npm install
npm run build   # télécharge la spec et génère le code serveur
npm run dev     # démarre en mode développement
```

## Health check

```bash
curl http://localhost:${{ values.port }}/health
```
