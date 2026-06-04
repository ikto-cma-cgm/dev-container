# ${{ values.name }}

${{ values.description }}

## Overview

Ce service suit une approche OpenAPI-first. La spécification distante est récupérée dans `src/openapi.yaml` au moment du build, puis utilisée pour générer le code serveur TypeScript Express.

## Catalog entities

- `Component`: service runtime Node.js
- `API`: contrat OpenAPI exposé par le service
