# Liquibase Database Migrations Template

Scaffolds a Liquibase migration project with `db-changelog`, `deployit-manifest` and Backstage Component registration.

## Purpose

This template generates a Liquibase migrations project skeleton including:
- Liquibase changelog structure (`src/001_scripts/`)
- Initial `001_scripts.xml` + sample SQL
- XL Deploy manifest (`deployit-manifest.xml`)
- CI pipeline configuration (`pipeline.yml`)
- Backstage `catalog-info.yaml` for automatic catalog registration
- TechDocs scaffolding (`mkdocs.yml` + `docs/`)

## Usage

This template is consumed via the Backstage Developer Portal. Navigate to **Create → Liquibase Database Migrations** and fill in the form.

## Ownership

- **Owner**: `group:default/it-development-software-engineering-developer-platform` (Developer Portal Team)
- **Maintainers**: Developer Portal Team members. Pull requests welcome via the repository's standard review process.
- **Support**: open an issue on the repository, or reach out to the Developer Portal Team channel.
- **Contribution**: changes must pass the R01–R19 lint check (`./scripts/lint.sh output/templates/liquibase-service-template/`). Breaking changes follow Semantic Versioning — see `CHANGELOG.md`.

## Compliance with ADR-0001 Composable Service Governance

| Rule | Status | Notes |
|---|---|---|
| **R1** SemVer | ✅ See `CHANGELOG.md` and Git tags (`v<MAJOR>.<MINOR>.<PATCH>`) |
| **R2** Pinning | N/A (unit template, not a composite consuming skeleton references) |
| **R3** Lifecycle | ✅ Generated `catalog-info.yaml` uses `lifecycle: experimental` |
| **R4** Ownership | ✅ This section + `CHANGELOG.md` + notification of consumer-breaking changes per Rule 4 |
| **R5** Cascade | N/A (unit template) |

## Linter status

Latest run: **19/19** R01–R19 rules passed.

## Notes

- `spec.type: service` is used on the generated `kind: Component` to conform with R05 valid types — semantically debatable for a migrations project (alternative could be a new `migrations` type added to `lint-rules.yaml`); kept as-is pending team discussion.
- Generated entity is currently `kind: Component` (was `kind: Resource` previously — switched for catalog visibility, see commit `b3032d0` in the project history).

## Related

- ADR-0001 — Composable Service Governance
- SMT-99 — Composable Service standards (TechDocs in `backstage-documentation` repo)
- `springboot-liquibase-composition-template` — composite that bundles a Spring Boot service with Liquibase migrations
