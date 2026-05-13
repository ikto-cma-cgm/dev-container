# ${{ values.name }}

Documentation pour la librairie ${{ values.name }}.

## Architecture

Cette librairie est construite avec :

- Java ${{ values.javaVersion }}
- Spring Boot ${{ values.springBootVersion }}
- Maven

## Utilisation

Ajoutez la dépendance à votre projet Maven :

```xml
<dependency>
    <groupId>${{ values.groupId }}</groupId>
    <artifactId>${{ values.name }}</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Publication

La publication sur Nexus est automatisée par le pipeline CI/CD.

```bash
mvn clean deploy -Prelease
```

## Runbook

Consultez le [On-call runbook](https://wiki.cma-cgm.com/${{ values.name }}/runbook) pour les procédures.
