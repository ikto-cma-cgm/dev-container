# ${{ values.name }}

${{ values.description }}

## Technologies

- Java ${{ values.javaVersion }}
- Spring Boot ${{ values.springBootVersion }}
- PostgreSQL
- Maven

## Source of truth

The OpenAPI specification at `src/main/resources/api/openapi.yaml` is the **source of truth** for this service's contract. The API code (controller interfaces, DTO models) is generated from it at build time via the OpenAPI Generator Maven plugin.

To regenerate after editing the spec:

```bash
mvn generate-sources
```

To edit the spec while keeping HIP compliance, run the `jtbd-api-designer` opencode agent shipped in the CMA-CGM dev-container.

## Run locally

```bash
mvn clean install
mvn spring-boot:run -Plocal
```

Swagger UI: `http://localhost:8080/swagger-ui.html`

## Monitoring

Actuator is exposed at `http://localhost:8080/actuator`.
