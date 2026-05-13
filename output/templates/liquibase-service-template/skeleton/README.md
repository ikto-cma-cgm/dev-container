# ${{ values.name }}

${{ values.description }}

## Migration de base de données

Scripts Liquibase pour la base de données ${{ values.dbms }}.

### Structure

```
src/001_scripts/
  db-changelog.xml      ← Fichier racine Liquibase
  001_scripts.xml       ← Set de changelog
  001_scripts.sql       ← Scripts SQL initiaux
```

### Ajouter une nouvelle migration

1. Créez un nouveau fichier `002_scripts.xml` dans `src/002_scripts/`
2. Ajoutez le nouvel include dans `db-changelog.xml`
3. Déployez via XL Deploy
