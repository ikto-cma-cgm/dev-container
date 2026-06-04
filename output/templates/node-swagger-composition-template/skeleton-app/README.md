# ${{ values.name }}

${{ values.description }}

## Overview

Ce service suit une approche OpenAPI-first. La spécification distante est copiée localement dans `src/openapi.yaml` puis utilisée pour générer le code serveur TypeScript Express.

## Catalog entities

- `Component`: service runtime Node.js
- `API`: contrat OpenAPI exposé par le service (`${{ values.name }}-api`)

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
