# Liquibase Database Migrations Template

Ce template génère un projet de migrations Liquibase avec db-changelog, deployit-manifest pour XL Deploy et lintégration Backstage.

## Comment utiliser

- Via la section **Create** dans Backstage
- En lançant le template **Liquibase Database Migrations**

## Création d'un projet

### Étape 1 : Métadonnées
- **Service name** : nom unique en kebab-case.
- **Description** : brève description.
- **Owner** : équipe responsable.

### Étape 2 : Placement Catalog
- **System** : System Backstage.
- **Domain** : domaine métier.

### Étape 3 : Configuration Liquibase
- **Changelog name** : nom dans deployit-manifest.xml.
- **Application path** : chemin XLD (architecture_area/namespace).
- **Database type** : PostgreSQL ou Oracle.
