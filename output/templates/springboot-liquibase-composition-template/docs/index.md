# Spring Boot + Liquibase Composition Template

Ce template orchestre la création dun microservice Spring Boot avec des migrations Liquibase intégrées dans un seul dépöt.

## Comment utiliser

- Via la section **Create** dans Backstage
- En lançant le template **Spring Boot + Liquibase Composition**

## Création

### Étape 1 : Métadonnées du service
- **Service name** : nom unique en kebab-case.
- **Description** : brève description.
- **Owner** : équipe responsable.

### Étape 2 : Placement Catalog
- **System** : system Backstage.
- **Domain** : domaine métier.

### Étape 3 : Configuration
- **Java version** : 17 ou 21.
- **Maven Group ID** : groupe Maven.
- **Database type** : PostgreSQL ou Oracle.

Les migrations Liquibase sont générées dans `src/main/resources/db/migration/`.
