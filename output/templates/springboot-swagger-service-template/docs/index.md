# Spring Boot from OpenAPI — Template

Scaffolds a fully wired Spring Boot 3 microservice by providing a single OpenAPI/Swagger spec URL.

## What this template does

1. Fetches the skeleton (Maven project, Dockerfile, pipeline config, Backstage metadata)
2. Downloads your OpenAPI spec from the URL you provide
3. Runs `openapi-generator-cli` to produce Java controllers, models, and delegate interfaces
4. Publishes the repository to GitHub
5. Registers the service and API in the Backstage Catalog

## Parameters

| Param | Required | Description |
|---|---|---|
| `name` | Yes | Kebab-case service name for the Catalog |
| `description` | Yes | One-sentence service description |
| `owner` | Yes | Team responsible (entity picker) |
| `system` | Yes | Backstage system this belongs to |
| `domain` | Yes | Business domain |
| `swaggerUrl` | Yes | Public URL to OpenAPI 3.x spec (YAML or JSON) |
| `githubOwner` | Yes (default: `cma-cgm`) | GitHub organization |
| HIP metadata | No | Collapsible advanced section for enterprise-arch annotations |

## Defaults (hidden from the form)

| Setting | Default |
|---|---|
| Java version | 21 |
| Spring Boot | 3.4.2 |
| Spring Cloud | 2024.0.0 |
| Maven groupId | com.cma |
| Package name | derived from `name` (e.g. `quote-pricing-api` → `com.cma.quotepricing`) |
| Docker registry | eu.gcr.io/cma-cgm |
| API type | system |
| API Lead / Factory | same as `owner` |
| Architectural domain | same as `domain` |
