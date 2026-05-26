# ${{ values.name }}

${{ values.description }}

## Technologies

- Java 21
- Spring Boot 3.4.2
- PostgreSQL
- Maven

## Source of truth

The OpenAPI specification at `src/main/resources/api/openapi.yaml` is the **source of truth** for this service API. Controller interfaces and DTO models are auto-generated from it at build time via the OpenAPI Generator Maven plugin.

To regenerate after editing the spec:

```bash
mvn generate-sources
```

## Run locally

```bash
mvn clean install
mvn spring-boot:run -Plocal
```

Swagger UI: `http://localhost:8080/swagger-ui.html`

## Monitoring

Actuator endpoints exposed at `http://localhost:9090/actuator`.

## Implementing the API

Generated delegate interfaces live in `${{ values.packageName }}.api.service.delegate`. Implement each interface and back it with real business logic. Example:

```java
package ${{ values.packageName }}.api.service.delegate;

import org.springframework.stereotype.Service;

@Service
public class YourApiDelegate implements YourApiDelegateInterface {

    @Override
    public ResponseEntity<YourResponse> yourEndpoint(YourRequest request) {
        // TODO: implement business logic
        return ResponseEntity.ok(null);
    }
}
```
