# Node.js Microservice with OpenAPI Spec Template

Ce template génère un microservice Node.js TypeScript piloté par une spécification OpenAPI distante, avec les métadonnées HIP pour la gouvernance API.

## Ce qui est généré

- un service Express prêt pour du contract-first
- une entité `Component` et une entité `API` dans le Catalog avec annotations HIP
- un script de récupération de la spécification distante
- une génération de code serveur via OpenAPI Generator
- les fichiers TechDocs et Docker

## Utilisation

1. fournissez une URL OpenAPI accessible publiquement
2. renseignez le nom, la description, l'owner et le system
3. renseignez les métadonnées HIP (api-type, HOPEX code, etc.)
4. choisissez GitHub ou GitLab comme plateforme de publication
5. exécutez `npm run build` dans le dépôt généré pour télécharger la spec et générer le code serveur (dans `src/openapi-generated/`)

## Lien avec swagger-template

Ce template est la composition Node.js + OpenAPI du `swagger-template` unitaire.
Pour gérer le contrat API indépendamment du service, utilisez `swagger-template` à la place.
