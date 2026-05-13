# ${{ values.name }}

${{ values.description }}

## Quick Start

```bash
mvn clean install
```

## Deployment

```bash
mvn clean deploy -Prelease
```

## Dependency

Ajoutez cette dépendance à votre projet Maven :

```xml
<dependency>
    <groupId>${{ values.groupId }}</groupId>
    <artifactId>${{ values.name }}</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Tech Docs

See [Tech Docs](https://wiki.cma-cgm.com/${{ values.name }}) for detailed documentation.
