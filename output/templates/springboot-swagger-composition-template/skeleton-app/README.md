# ${{ values.name }}

${{ values.description }}

## Overview

Ce service suit une approche OpenAPI-first. La spécification est consommée depuis `${{ values.swaggerUrl }}` lors du build Maven et utilisée pour générer les interfaces Spring Boot via `openapi-generator-maven-plugin`.

## Catalog entities

- `Component`: service runtime Spring Boot
- `API`: contrat OpenAPI exposé par le service (`${{ values.name }}-api`)

## Getting started

```bash
mvn clean install       # génère les interfaces API depuis la spec
mvn spring-boot:run -Plocal   # démarre en mode développement
```

## Implémentation

Après le build, implémentez l'interface générée :

```java
@RestController
public class MyController implements ${{ values.packageName }}.api.controller.MyApi {
    // ...
}
```

## Swagger UI

```
http://localhost:8080/swagger-ui.html
```
