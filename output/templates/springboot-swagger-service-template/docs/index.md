# Spring Boot Microservice from OpenAPI Spec

This template scaffolds a Spring Boot 3 microservice whose API code is generated from a HIP-compliant OpenAPI/Swagger specification provided by the user.

## Workflow

The template is the **consumer side** of a two-step authoring flow. The author side is the `jtbd-api-designer` opencode agent shipped in the same `dev-container`.

1. **Author the spec** — run the `jtbd-api-designer` opencode agent. Interviewed by the agent, you produce a HIP-compliant OpenAPI 3.0.3 spec (enforces the 4 mandatory `x-` extensions, the title regex, the standard error responses 400/401/403/416/500, a reusable `Error` schema referenced via `$ref`, and a `securitySchemes` entry).
2. **Publish the spec** — push the YAML file to a Git-hosted URL accessible by Backstage (typically the HIP `cartography` repo in GitLab).
3. **Scaffold the service** — open this template in Backstage, fill the form (including the spec URL and the optional HIP metadata), submit. The scaffolder downloads the spec, generates the Spring Boot project, and registers both a `kind: Component` and a `kind: API` entity in the catalog.

## How it works

1. **Fetch skeleton** — the Spring Boot skeleton (Maven, Docker, CI) is copied.
2. **Fetch OpenAPI spec** — the spec is downloaded from the URL provided in the form and placed at `src/main/resources/api/openapi.yaml`.
3. **Publish + Register** — the code is published to Git and registered in the Backstage catalog (`kind: Component` for the service, `kind: API` referencing the spec).

After scaffolding, `mvn generate-sources` generates controller interfaces, models and APIs from the OpenAPI specification.

## Technical details

- OpenAPI Generator Maven plugin (mode `interfaceOnly` + `delegatePattern`).
- Generated interfaces live under `${{ values.packageName }}.api.controller`.
- Delegate implementations to author live under `${{ values.packageName }}.api.service.delegate`.
- Generated DTO models live under `${{ values.packageName }}.api.model`.

## HIP compliance

The source spec at `src/main/resources/api/openapi.yaml` is expected to pass the HIP Spectral ruleset (4 blocks, 4 mandatory `x-` extensions). If the spec was authored via the `jtbd-api-designer` agent, compliance is enforced by construction. Otherwise, run Spectral locally with the `stoplight.spectral` VS Code extension (shipped in the dev-container) before scaffolding.

## References

- [OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Spectral](https://stoplight.io/open-source/spectral) — HIP ruleset enforced on the cartography repo
- `jtbd-api-designer` opencode agent — shipped in `agents/` of this dev-container
