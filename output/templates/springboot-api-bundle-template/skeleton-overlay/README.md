# ${{ values.name }}

${{ values.description }}

## Getting started

```bash
git clone <repo-url>
cd ${{ values.name }}
make init   # generates API sources, inlines them, compiles — run once
make run    # starts locally on http://localhost:8080
```

Swagger UI : **http://localhost:8080/swagger-ui.html**

## What's included

- Spring Boot ${{ values.springBootVersion }} REST service
- OpenAPI 3.0 spec in `src/main/resources/api/openapi.yaml`
- Generated interfaces and DTOs inlined in `src/main/java/${{ values.packagePath }}/api/`
- Two Catalog entities: `Component` (${{ values.name }}) + `API` (${{ values.name }}-api)

## Implement your business logic

After `make init`, implement your service delegates:

```java
@Service
public class ResourcesApiDelegateImpl implements ResourcesApiDelegate {
    @Override
    public ResponseEntity<Resource> createResource(ResourceRequest body) {
        // your logic here
    }
}
```

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `SERVER_PORT` | No | `8080` | HTTP server port |
| `MANAGEMENT_SERVER_PORT` | No | `9090` | Actuator port |

## Catalog

- Component: [${{ values.name }}](${{ values.repoOwner }}/${{ values.name }})
- API: [${{ values.name }}-api](spec at `src/main/resources/api/openapi.yaml`)
- System: ${{ values.system }} / Domain: ${{ values.domain }}
